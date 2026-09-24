const STATUS_STYLES = {
  Active: "bg-emerald-50 text-emerald-700",
  Admitted: "bg-amber-50 text-amber-700",
  Discharged: "bg-slate-100 text-slate-600",
  Scheduled: "bg-brand-50 text-brand-700",
  Confirmed: "bg-teal-50 text-teal-700",
  Waiting: "bg-amber-50 text-amber-700",
  Completed: "bg-emerald-50 text-emerald-700",
  Cancelled: "bg-red-50 text-red-700",
  Paid: "bg-emerald-50 text-emerald-700",
  Pending: "bg-amber-50 text-amber-700",
  Refunded: "bg-slate-100 text-slate-600",
  Available: "bg-emerald-50 text-emerald-700",
  "On Leave": "bg-slate-100 text-slate-600",
  "In Consultation": "bg-amber-50 text-amber-700",
};

export default function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || "bg-slate-100 text-slate-600";
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${style}`}>
      {status}
    </span>
  );
}
