import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { CalendarPlus, CheckCircle2, XCircle } from "lucide-react";
import { Card } from "../../components/Card";
import DataTable from "../../components/DataTable";
import StatusBadge from "../../components/Badge";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import { Field, Input, Select } from "../../components/FormField";
import { appointmentService } from "../../services/appointmentService";
import { patientService } from "../../services/patientService";
import { doctorService } from "../../services/doctorService";
import { useToast } from "../../context/ToastContext";

const STATUSES = ["All", "Scheduled", "Confirmed", "Waiting", "Completed", "Cancelled"];
const TYPES = ["Consultation", "Follow-up", "Emergency", "Checkup"];

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [status, setStatus] = useState("All");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const location = useLocation();
  const { push } = useToast();

  const [form, setForm] = useState({
    patient: location.state?.patientId || "",
    doctor: "",
    department: "",
    date: new Date().toISOString().slice(0, 10),
    time: "10:00 AM",
    type: "Consultation",
  });

  function load() {
    setLoading(true);
    appointmentService
      .list({ status })
      .then(setAppointments)
      .catch(() => push("Could not load appointments.", "error"))
      .finally(() => setLoading(false));
  }

  useEffect(load, [status]);
  useEffect(() => {
    patientService.list({}).then(setPatients);
    doctorService.list().then(setDoctors);
  }, []);

  useEffect(() => {
    if (location.state?.patientId) setOpen(true);
  }, [location.state]);

  function handleDoctorChange(doctorId) {
    const doc = doctors.find((d) => d._id === doctorId);
    setForm((f) => ({ ...f, doctor: doctorId, department: doc?.department || "" }));
  }

  async function handleBook(e) {
    e.preventDefault();
    if (!form.patient || !form.doctor) return push("Select a patient and doctor.", "error");
    setSaving(true);
    try {
      await appointmentService.create(form);
      push("Appointment booked successfully.", "success");
      setOpen(false);
      load();
    } catch {
      push("Unable to save the record. Please try again.", "error");
    } finally {
      setSaving(false);
    }
  }

  async function setApptStatus(id, newStatus) {
    try {
      await appointmentService.update(id, { status: newStatus });
      push(`Appointment marked as ${newStatus}.`, "success");
      load();
    } catch {
      push("Unable to update appointment.", "error");
    }
  }

  const columns = [
    { key: "date", label: "Date", render: (r) => new Date(r.date).toLocaleDateString() },
    { key: "time", label: "Time" },
    { key: "patient", label: "Patient", render: (r) => `${r.patient?.firstName} ${r.patient?.lastName}` },
    { key: "doctor", label: "Doctor", render: (r) => r.doctor?.name },
    { key: "department", label: "Department" },
    { key: "type", label: "Type" },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
    {
      key: "actions",
      label: "Actions",
      render: (r) =>
        r.status !== "Completed" && r.status !== "Cancelled" ? (
          <div className="flex items-center gap-2">
            <button title="Mark completed" onClick={() => setApptStatus(r._id, "Completed")} className="text-slate-400 hover:text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
            </button>
            <button title="Cancel" onClick={() => setApptStatus(r._id, "Cancelled")} className="text-slate-400 hover:text-red-600">
              <XCircle className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <span className="text-slate-300">—</span>
        ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex gap-2 flex-wrap">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                status === s ? "bg-brand-600 text-white border-brand-600" : "bg-white text-slate-500 border-slate-200 hover:border-brand-300"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <Button onClick={() => setOpen(true)}><CalendarPlus className="h-4 w-4" /> Book Appointment</Button>
      </div>

      <Card>
        <DataTable
          columns={columns}
          rows={appointments}
          loading={loading}
          emptyTitle="No appointments found"
          emptyAction={<Button onClick={() => setOpen(true)}>Book Appointment</Button>}
        />
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Book Appointment">
        <form onSubmit={handleBook} className="space-y-4">
          <Field label="Patient" required>
            <Select value={form.patient} onChange={(e) => setForm({ ...form, patient: e.target.value })} required>
              <option value="">Select patient</option>
              {patients.map((p) => <option key={p._id} value={p._id}>{p.firstName} {p.lastName} ({p.patientCode})</option>)}
            </Select>
          </Field>
          <Field label="Doctor" required>
            <Select value={form.doctor} onChange={(e) => handleDoctorChange(e.target.value)} required>
              <option value="">Select doctor</option>
              {doctors.map((d) => <option key={d._id} value={d._id}>{d.name} — {d.department}</option>)}
            </Select>
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Date" required>
              <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
            </Field>
            <Field label="Time" required>
              <Input value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} placeholder="10:00 AM" required />
            </Field>
          </div>
          <Field label="Appointment type">
            <Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              {TYPES.map((t) => <option key={t}>{t}</option>)}
            </Select>
          </Field>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? "Booking..." : "Book"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
