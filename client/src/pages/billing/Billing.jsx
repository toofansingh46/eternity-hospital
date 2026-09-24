import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Plus, Trash2, FileText, IndianRupee, Clock, CheckCircle2 } from "lucide-react";
import { Card } from "../../components/Card";
import DataTable from "../../components/DataTable";
import StatusBadge from "../../components/Badge";
import StatCard from "../../components/StatCard";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import { Field, Input, Select } from "../../components/FormField";
import { billingService } from "../../services/billingService";
import { patientService } from "../../services/patientService";
import { doctorService } from "../../services/doctorService";
import { useToast } from "../../context/ToastContext";

const SERVICE_OPTIONS = ["Consultation", "Room Charges", "Laboratory", "Pharmacy", "Procedure", "Other"];
const METHODS = ["Cash", "Card", "UPI", "Insurance"];

export default function Billing() {
  const [invoices, setInvoices] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const location = useLocation();
  const { push } = useToast();

  const [form, setForm] = useState({
    patient: location.state?.patientId || "",
    doctor: "",
    department: "",
    items: [{ service: "Consultation", amount: 500 }],
    discount: 0,
    paymentMethod: "Cash",
    paymentStatus: "Pending",
  });

  function load() {
    setLoading(true);
    billingService.list().then(setInvoices).catch(() => push("Could not load invoices.", "error")).finally(() => setLoading(false));
  }

  useEffect(load, []);
  useEffect(() => {
    patientService.list({}).then(setPatients);
    doctorService.list().then(setDoctors);
  }, []);
  useEffect(() => {
    if (location.state?.patientId) setOpen(true);
  }, [location.state]);

  const subtotal = useMemo(() => form.items.reduce((s, i) => s + Number(i.amount || 0), 0), [form.items]);
  const tax = useMemo(() => Math.round((subtotal - form.discount) * 0.05), [subtotal, form.discount]);
  const total = useMemo(() => Math.max(subtotal - form.discount + tax, 0), [subtotal, form.discount, tax]);

  function updateItem(idx, key, value) {
    setForm((f) => {
      const items = [...f.items];
      items[idx] = { ...items[idx], [key]: value };
      return { ...f, items };
    });
  }
  function addItem() {
    setForm((f) => ({ ...f, items: [...f.items, { service: "Consultation", amount: 0 }] }));
  }
  function removeItem(idx) {
    setForm((f) => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.patient) return push("Select a patient.", "error");
    setSaving(true);
    try {
      await billingService.create({ ...form, subtotal, tax, total });
      push("Invoice generated successfully.", "success");
      setOpen(false);
      setForm({ patient: "", doctor: "", department: "", items: [{ service: "Consultation", amount: 500 }], discount: 0, paymentMethod: "Cash", paymentStatus: "Pending" });
      load();
    } catch {
      push("Unable to save the record. Please try again.", "error");
    } finally {
      setSaving(false);
    }
  }

  async function markPaid(id) {
    try {
      await billingService.update(id, { paymentStatus: "Paid" });
      push("Invoice marked as paid.", "success");
      load();
    } catch {
      push("Unable to update invoice.", "error");
    }
  }

  const totalRevenue = invoices.filter((i) => i.paymentStatus === "Paid").reduce((s, i) => s + i.total, 0);
  const pendingRevenue = invoices.filter((i) => i.paymentStatus === "Pending").reduce((s, i) => s + i.total, 0);

  const columns = [
    { key: "invoiceCode", label: "Invoice ID" },
    { key: "patient", label: "Patient", render: (r) => `${r.patient?.firstName} ${r.patient?.lastName}` },
    { key: "date", label: "Date", render: (r) => new Date(r.date).toLocaleDateString() },
    { key: "total", label: "Amount", render: (r) => `₹${r.total.toLocaleString()}` },
    { key: "paymentMethod", label: "Method" },
    { key: "paymentStatus", label: "Status", render: (r) => <StatusBadge status={r.paymentStatus} /> },
    {
      key: "actions",
      label: "Actions",
      render: (r) =>
        r.paymentStatus === "Pending" ? (
          <button onClick={() => markPaid(r._id)} className="text-xs text-brand-600 hover:underline flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" /> Mark Paid
          </button>
        ) : (
          <span className="text-slate-300">—</span>
        ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard label="Total Revenue" value={totalRevenue} prefix="₹" icon={IndianRupee} tint="emerald" />
        <StatCard label="Pending Amount" value={pendingRevenue} prefix="₹" icon={Clock} tint="amber" />
        <StatCard label="Total Invoices" value={invoices.length} icon={FileText} tint="brand" />
      </div>

      <div className="flex justify-end">
        <Button onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> Create Invoice</Button>
      </div>

      <Card>
        <DataTable columns={columns} rows={invoices} loading={loading} emptyTitle="No invoices found" emptyAction={<Button onClick={() => setOpen(true)}>Create Invoice</Button>} />
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Create Invoice" size="lg">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Patient" required>
              <Select value={form.patient} onChange={(e) => setForm({ ...form, patient: e.target.value })} required>
                <option value="">Select patient</option>
                {patients.map((p) => <option key={p._id} value={p._id}>{p.firstName} {p.lastName} ({p.patientCode})</option>)}
              </Select>
            </Field>
            <Field label="Doctor">
              <Select
                value={form.doctor}
                onChange={(e) => {
                  const doc = doctors.find((d) => d._id === e.target.value);
                  setForm({ ...form, doctor: e.target.value, department: doc?.department || "" });
                }}
              >
                <option value="">None</option>
                {doctors.map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}
              </Select>
            </Field>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-slate-600">Services</p>
              <button type="button" onClick={addItem} className="text-xs text-brand-600 hover:underline">+ Add service</button>
            </div>
            <div className="space-y-2">
              {form.items.map((item, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <Select value={item.service} onChange={(e) => updateItem(idx, "service", e.target.value)} className="flex-1">
                    {SERVICE_OPTIONS.map((s) => <option key={s}>{s}</option>)}
                  </Select>
                  <Input type="number" min="0" value={item.amount} onChange={(e) => updateItem(idx, "amount", Number(e.target.value))} className="w-32" placeholder="Amount" />
                  {form.items.length > 1 && (
                    <button type="button" onClick={() => removeItem(idx)} className="text-slate-400 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Discount (₹)">
              <Input type="number" min="0" value={form.discount} onChange={(e) => setForm({ ...form, discount: Number(e.target.value) })} />
            </Field>
            <Field label="Payment method">
              <Select value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}>
                {METHODS.map((m) => <option key={m}>{m}</option>)}
              </Select>
            </Field>
          </div>

          <div className="bg-canvas rounded-lg p-4 space-y-1.5 text-sm">
            <div className="flex justify-between text-slate-500"><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
            <div className="flex justify-between text-slate-500"><span>Discount</span><span>-₹{Number(form.discount).toLocaleString()}</span></div>
            <div className="flex justify-between text-slate-500"><span>Tax (5%)</span><span>₹{tax.toLocaleString()}</span></div>
            <div className="flex justify-between font-semibold text-ink pt-1.5 border-t border-slate-200 mt-1.5"><span>Total</span><span>₹{total.toLocaleString()}</span></div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Invoice"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
