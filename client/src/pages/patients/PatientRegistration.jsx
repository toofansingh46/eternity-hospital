import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Card } from "../../components/Card";
import { Field, Input, Select, Textarea } from "../../components/FormField";
import Button from "../../components/Button";
import { patientService } from "../../services/patientService";
import { useToast } from "../../context/ToastContext";

const initial = {
  firstName: "", lastName: "", dob: "", gender: "Male", bloodGroup: "O+",
  phone: "", email: "", address: "", city: "", state: "",
  emergencyContact: "", relationship: "", allergies: "", existingConditions: "",
  currentMedication: "", notes: "",
};

export default function PatientRegistration() {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const { push } = useToast();

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function validate() {
    const errs = {};
    if (!form.firstName.trim()) errs.firstName = "First name is required";
    if (!form.lastName.trim()) errs.lastName = "Last name is required";
    if (!form.dob) errs.dob = "Date of birth is required";
    if (!/^\d{7,15}$/.test(form.phone)) errs.phone = "Enter a valid phone number";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Enter a valid email address";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const patient = await patientService.create(form);
      setSuccess(patient);
      push("Patient registered successfully.", "success");
    } catch (err) {
      push(err.response?.data?.message || "Unable to save the record. Please try again.", "error");
    } finally {
      setSaving(false);
    }
  }

  function handleClear() {
    setForm(initial);
    setErrors({});
  }

  if (success) {
    return (
      <Card className="max-w-lg mx-auto p-10 text-center">
        <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <CheckCircle2 className="h-14 w-14 text-emerald-500 mx-auto mb-4" />
        </motion.div>
        <h2 className="font-display font-semibold text-xl text-ink">Patient registered</h2>
        <p className="text-slate-500 mt-2">
          {success.firstName} {success.lastName} was assigned patient ID
        </p>
        <p className="font-mono text-lg text-brand-700 font-semibold mt-1">{success.patientCode}</p>
        <div className="flex justify-center gap-3 mt-6">
          <Button variant="secondary" onClick={() => { setSuccess(null); handleClear(); }}>Register Another</Button>
          <Button onClick={() => navigate(`/patients/${success._id}`)}>View Patient</Button>
        </div>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-4xl">
      <Card className="p-6">
        <p className="font-medium text-ink mb-4">Patient information</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Field label="First name" required error={errors.firstName}>
            <Input value={form.firstName} onChange={(e) => update("firstName", e.target.value)} />
          </Field>
          <Field label="Last name" required error={errors.lastName}>
            <Input value={form.lastName} onChange={(e) => update("lastName", e.target.value)} />
          </Field>
          <Field label="Date of birth" required error={errors.dob}>
            <Input type="date" value={form.dob} onChange={(e) => update("dob", e.target.value)} />
          </Field>
          <Field label="Gender" required>
            <Select value={form.gender} onChange={(e) => update("gender", e.target.value)}>
              {["Male", "Female", "Other"].map((g) => <option key={g}>{g}</option>)}
            </Select>
          </Field>
          <Field label="Blood group">
            <Select value={form.bloodGroup} onChange={(e) => update("bloodGroup", e.target.value)}>
              {["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-", "Unknown"].map((g) => <option key={g}>{g}</option>)}
            </Select>
          </Field>
          <Field label="Phone" required error={errors.phone}>
            <Input value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="9876543210" />
          </Field>
          <Field label="Email" error={errors.email}>
            <Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} />
          </Field>
          <Field label="City">
            <Input value={form.city} onChange={(e) => update("city", e.target.value)} />
          </Field>
          <Field label="State">
            <Input value={form.state} onChange={(e) => update("state", e.target.value)} />
          </Field>
          <div className="sm:col-span-2 lg:col-span-3">
            <Field label="Address">
              <Input value={form.address} onChange={(e) => update("address", e.target.value)} />
            </Field>
          </div>
          <Field label="Emergency contact">
            <Input value={form.emergencyContact} onChange={(e) => update("emergencyContact", e.target.value)} />
          </Field>
          <Field label="Relationship">
            <Input value={form.relationship} onChange={(e) => update("relationship", e.target.value)} placeholder="e.g. Father, Spouse" />
          </Field>
        </div>
      </Card>

      <Card className="p-6">
        <p className="font-medium text-ink mb-4">Medical information</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Allergies">
            <Input value={form.allergies} onChange={(e) => update("allergies", e.target.value)} placeholder="e.g. Penicillin" />
          </Field>
          <Field label="Existing conditions">
            <Input value={form.existingConditions} onChange={(e) => update("existingConditions", e.target.value)} placeholder="e.g. Hypertension" />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Current medication">
              <Input value={form.currentMedication} onChange={(e) => update("currentMedication", e.target.value)} />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Notes">
              <Textarea value={form.notes} onChange={(e) => update("notes", e.target.value)} />
            </Field>
          </div>
        </div>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Patient"}</Button>
        <Button type="button" variant="secondary" onClick={handleClear}>Clear</Button>
        <Button type="button" variant="ghost" onClick={() => navigate("/patients")}>Cancel</Button>
      </div>
    </form>
  );
}
