import { useEffect, useState } from "react";
import { UserPlus, Award, Clock, IndianRupee } from "lucide-react";
import { Card } from "../../components/Card";
import StatusBadge from "../../components/Badge";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import LoadingSkeleton from "../../components/LoadingSkeleton";
import EmptyState from "../../components/EmptyState";
import { Field, Input, Select } from "../../components/FormField";
import { doctorService } from "../../services/doctorService";
import { useToast } from "../../context/ToastContext";

const DEPARTMENTS = ["Cardiology", "Pediatrics", "Orthopedics", "Dermatology", "General Medicine", "Neurology"];

export default function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", specialization: "", department: DEPARTMENTS[0], experienceYears: 1, consultationFee: 500, qualifications: "" });
  const { push } = useToast();

  function load() {
    setLoading(true);
    doctorService.list().then(setDoctors).catch(() => push("Could not load doctors.", "error")).finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleAdd(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await doctorService.create(form);
      push("Doctor added successfully.", "success");
      setOpen(false);
      setForm({ name: "", specialization: "", department: DEPARTMENTS[0], experienceYears: 1, consultationFee: 500, qualifications: "" });
      load();
    } catch {
      push("Unable to add doctor.", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <Button onClick={() => setOpen(true)}><UserPlus className="h-4 w-4" /> Add Doctor</Button>
      </div>

      {loading ? (
        <Card><LoadingSkeleton rows={6} /></Card>
      ) : doctors.length === 0 ? (
        <Card><EmptyState title="No doctors yet" action={<Button onClick={() => setOpen(true)}>Add Doctor</Button>} /></Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {doctors.map((d) => (
            <Card key={d._id} className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center font-semibold shrink-0">
                    {d.name.replace("Dr. ", "").split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-medium text-ink">{d.name}</p>
                    <p className="text-xs text-slate-500">{d.specialization}</p>
                  </div>
                </div>
                <StatusBadge status={d.status} />
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-sm text-slate-600">
                <p className="flex items-center gap-2"><Award className="h-3.5 w-3.5 text-brand-500" /> {d.department}</p>
                <p className="flex items-center gap-2"><Clock className="h-3.5 w-3.5 text-brand-500" /> {d.experienceYears} yrs experience</p>
                <p className="flex items-center gap-2"><IndianRupee className="h-3.5 w-3.5 text-brand-500" /> ₹{d.consultationFee} consultation</p>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Add Doctor">
        <form onSubmit={handleAdd} className="space-y-4">
          <Field label="Full name" required>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Dr. First Last" required />
          </Field>
          <Field label="Specialization" required>
            <Input value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} required />
          </Field>
          <Field label="Department" required>
            <Select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}>
              {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
            </Select>
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Experience (years)">
              <Input type="number" min="0" value={form.experienceYears} onChange={(e) => setForm({ ...form, experienceYears: Number(e.target.value) })} />
            </Field>
            <Field label="Consultation fee (₹)">
              <Input type="number" min="0" value={form.consultationFee} onChange={(e) => setForm({ ...form, consultationFee: Number(e.target.value) })} />
            </Field>
          </div>
          <Field label="Qualifications">
            <Input value={form.qualifications} onChange={(e) => setForm({ ...form, qualifications: e.target.value })} placeholder="MBBS, MD" />
          </Field>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Doctor"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
