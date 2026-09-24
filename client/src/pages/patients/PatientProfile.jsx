import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Phone, Mail, MapPin, Droplet, CalendarPlus, Receipt } from "lucide-react";
import { Card } from "../../components/Card";
import StatusBadge from "../../components/Badge";
import Button from "../../components/Button";
import DataTable from "../../components/DataTable";
import LoadingSkeleton from "../../components/LoadingSkeleton";
import { patientService } from "../../services/patientService";
import { useToast } from "../../context/ToastContext";

const TABS = ["Overview", "Appointments", "Billing"];

export default function PatientProfile() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("Overview");
  const navigate = useNavigate();
  const { push } = useToast();

  useEffect(() => {
    patientService
      .get(id)
      .then(setData)
      .catch(() => push("Could not load patient record.", "error"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Card className="p-6"><LoadingSkeleton rows={6} /></Card>;
  if (!data) return null;

  const { patient, appointments, invoices } = data;
  const age = Math.abs(new Date(Date.now() - new Date(patient.dob).getTime()).getUTCFullYear() - 1970);

  return (
    <div className="space-y-5">
      <button onClick={() => navigate("/patients")} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-brand-600">
        <ArrowLeft className="h-4 w-4" /> Back to patients
      </button>

      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xl font-semibold shrink-0">
              {patient.firstName[0]}{patient.lastName[0]}
            </div>
            <div>
              <h2 className="font-display font-semibold text-xl text-ink">{patient.firstName} {patient.lastName}</h2>
              <p className="text-sm text-slate-500">{patient.patientCode} · {patient.gender}, {age} yrs</p>
              <div className="mt-1"><StatusBadge status={patient.status} /></div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => navigate("/appointments", { state: { patientId: patient._id } })}>
              <CalendarPlus className="h-4 w-4" /> Book Appointment
            </Button>
            <Button variant="secondary" onClick={() => navigate("/billing", { state: { patientId: patient._id } })}>
              <Receipt className="h-4 w-4" /> Create Invoice
            </Button>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
          <InfoItem icon={Phone} label="Phone" value={patient.phone} />
          <InfoItem icon={Mail} label="Email" value={patient.email || "—"} />
          <InfoItem icon={MapPin} label="Location" value={[patient.city, patient.state].filter(Boolean).join(", ") || "—"} />
          <InfoItem icon={Droplet} label="Blood group" value={patient.bloodGroup} />
        </div>
      </Card>

      <div className="flex gap-1 border-b border-slate-200">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === t ? "border-brand-600 text-brand-700" : "border-transparent text-slate-500 hover:text-ink"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Overview" && (
        <Card className="p-6 grid sm:grid-cols-2 gap-6">
          <div>
            <p className="text-xs font-medium text-slate-400 mb-1">Allergies</p>
            <p className="text-sm text-ink">{patient.allergies || "None recorded"}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 mb-1">Existing conditions</p>
            <p className="text-sm text-ink">{patient.existingConditions || "None recorded"}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 mb-1">Current medication</p>
            <p className="text-sm text-ink">{patient.currentMedication || "None recorded"}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 mb-1">Emergency contact</p>
            <p className="text-sm text-ink">{patient.emergencyContact || "—"} ({patient.relationship || "—"})</p>
          </div>
          {patient.notes && (
            <div className="sm:col-span-2">
              <p className="text-xs font-medium text-slate-400 mb-1">Notes</p>
              <p className="text-sm text-ink">{patient.notes}</p>
            </div>
          )}
        </Card>
      )}

      {tab === "Appointments" && (
        <Card>
          <DataTable
            columns={[
              { key: "date", label: "Date", render: (r) => new Date(r.date).toLocaleDateString() },
              { key: "time", label: "Time" },
              { key: "doctor", label: "Doctor", render: (r) => r.doctor?.name },
              { key: "type", label: "Type" },
              { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
            ]}
            rows={appointments}
            emptyTitle="No appointments yet"
          />
        </Card>
      )}

      {tab === "Billing" && (
        <Card>
          <DataTable
            columns={[
              { key: "invoiceCode", label: "Invoice" },
              { key: "date", label: "Date", render: (r) => new Date(r.date).toLocaleDateString() },
              { key: "total", label: "Amount", render: (r) => `₹${r.total.toLocaleString()}` },
              { key: "paymentMethod", label: "Method" },
              { key: "paymentStatus", label: "Status", render: (r) => <StatusBadge status={r.paymentStatus} /> },
            ]}
            rows={invoices}
            emptyTitle="No invoices yet"
          />
        </Card>
      )}
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="h-4 w-4 text-brand-500 mt-0.5 shrink-0" />
      <div>
        <p className="text-xs text-slate-400">{label}</p>
        <p className="text-sm text-ink">{value}</p>
      </div>
    </div>
  );
}
