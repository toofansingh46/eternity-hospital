import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, UserPlus, Eye, Pencil, Trash2, CalendarPlus, Receipt } from "lucide-react";
import { Card } from "../../components/Card";
import DataTable from "../../components/DataTable";
import StatusBadge from "../../components/Badge";
import Button from "../../components/Button";
import ConfirmDialog from "../../components/ConfirmDialog";
import { patientService } from "../../services/patientService";
import { useToast } from "../../context/ToastContext";

function ageFromDob(dob) {
  const diff = Date.now() - new Date(dob).getTime();
  return Math.abs(new Date(diff).getUTCFullYear() - 1970);
}

export default function PatientList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [toDelete, setToDelete] = useState(null);
  const navigate = useNavigate();
  const { push } = useToast();

  function load() {
    setLoading(true);
    patientService
      .list({ search, status })
      .then(setPatients)
      .catch(() => push("Could not load patients.", "error"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [search, status]);

  async function handleDelete() {
    try {
      await patientService.remove(toDelete._id);
      push(`${toDelete.firstName} ${toDelete.lastName} was removed.`, "success");
      load();
    } catch {
      push("Unable to remove patient.", "error");
    }
  }

  const columns = [
    { key: "patientCode", label: "Patient ID" },
    { key: "name", label: "Name", render: (r) => `${r.firstName} ${r.lastName}` },
    { key: "gender", label: "Gender" },
    { key: "age", label: "Age", render: (r) => ageFromDob(r.dob) },
    { key: "phone", label: "Phone" },
    { key: "bloodGroup", label: "Blood Group" },
    { key: "lastVisit", label: "Last Visit", render: (r) => new Date(r.lastVisit).toLocaleDateString() },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
    {
      key: "actions",
      label: "Actions",
      render: (r) => (
        <div className="flex items-center gap-2">
          <button title="View" onClick={() => navigate(`/patients/${r._id}`)} className="text-slate-400 hover:text-brand-600">
            <Eye className="h-4 w-4" />
          </button>
          <button title="Book appointment" onClick={() => navigate("/appointments", { state: { patientId: r._id } })} className="text-slate-400 hover:text-teal-600">
            <CalendarPlus className="h-4 w-4" />
          </button>
          <button title="Billing" onClick={() => navigate("/billing", { state: { patientId: r._id } })} className="text-slate-400 hover:text-brand-600">
            <Receipt className="h-4 w-4" />
          </button>
          <button title="Delete" onClick={() => setToDelete(r)} className="text-slate-400 hover:text-red-600">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, ID or phone"
            className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 text-sm focus-ring bg-white"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border border-slate-200 text-sm px-3 py-2.5 bg-white focus-ring"
          >
            {["All", "Active", "Admitted", "Discharged"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <Button onClick={() => navigate("/registration")}>
            <UserPlus className="h-4 w-4" /> Register Patient
          </Button>
        </div>
      </div>

      <Card>
        <DataTable
          columns={columns}
          rows={patients}
          loading={loading}
          emptyTitle="No patients found"
          emptyAction={<Button onClick={() => navigate("/registration")}>Register New Patient</Button>}
        />
      </Card>

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={handleDelete}
        title="Remove patient"
        description={`This will permanently remove ${toDelete?.firstName} ${toDelete?.lastName} and their record from Eternity.`}
        confirmLabel="Remove"
      />
    </div>
  );
}
