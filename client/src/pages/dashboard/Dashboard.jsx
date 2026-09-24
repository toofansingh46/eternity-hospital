import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users, Stethoscope, CalendarCheck, IndianRupee, BedDouble, Receipt,
  UserPlus, CalendarPlus, FileText,
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Card } from "../../components/Card";
import StatCard from "../../components/StatCard";
import Button from "../../components/Button";
import LoadingSkeleton from "../../components/LoadingSkeleton";
import { dashboardService } from "../../services/dashboardService";
import { useToast } from "../../context/ToastContext";

const REVENUE_TREND = [
  { day: "Mon", revenue: 32000 }, { day: "Tue", revenue: 41000 }, { day: "Wed", revenue: 38000 },
  { day: "Thu", revenue: 52000 }, { day: "Fri", revenue: 47000 }, { day: "Sat", revenue: 61000 },
  { day: "Sun", revenue: 45000 },
];
const APPT_TREND = [
  { day: "Mon", appts: 18 }, { day: "Tue", appts: 24 }, { day: "Wed", appts: 21 },
  { day: "Thu", appts: 29 }, { day: "Fri", appts: 26 }, { day: "Sat", appts: 33 }, { day: "Sun", appts: 15 },
];
const PIE_COLORS = ["#116089", "#0d9488", "#45a3c9", "#f59e0b", "#7fc3dd", "#0f766e"];

const QUICK_ACTIONS = [
  { label: "Register Patient", icon: UserPlus, to: "/registration" },
  { label: "Book Appointment", icon: CalendarPlus, to: "/appointments" },
  { label: "Create Invoice", icon: FileText, to: "/billing" },
];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { push } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    dashboardService
      .stats()
      .then(setStats)
      .catch(() => push("Could not load dashboard stats from the server.", "error"))
      .finally(() => setLoading(false));
  }, []);

  const deptData = stats
    ? Object.entries(stats.departmentCounts).map(([name, value]) => ({ name, value }))
    : [];

  if (loading) {
    return (
      <Card>
        <LoadingSkeleton rows={8} />
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard label="Total Patients" value={stats.totalPatients} icon={Users} tint="brand" />
        <StatCard label="Today's Appointments" value={stats.todaysAppointments} icon={CalendarCheck} tint="teal" />
        <StatCard label="Available Doctors" value={stats.availableDoctors} icon={Stethoscope} tint="emerald" />
        <StatCard label="Revenue (Paid)" value={stats.totalRevenue} prefix="₹" icon={IndianRupee} tint="brand" />
        <StatCard label="Beds Available" value={38} icon={BedDouble} tint="teal" />
        <StatCard label="Pending Bills" value={stats.pendingBills} icon={Receipt} tint="amber" />
      </div>

      <Card className="p-5">
        <p className="text-sm font-medium text-ink mb-3">Quick actions</p>
        <div className="flex flex-wrap gap-3">
          {QUICK_ACTIONS.map((a) => (
            <Button key={a.label} variant="secondary" onClick={() => navigate(a.to)}>
              <a.icon className="h-4 w-4" /> {a.label}
            </Button>
          ))}
        </div>
      </Card>

      <div className="grid lg:grid-cols-3 gap-5">
        <Card className="p-5 lg:col-span-2">
          <p className="text-sm font-medium text-ink mb-4">Weekly revenue</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={REVENUE_TREND}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef2f6" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v) => [`₹${v.toLocaleString()}`, "Revenue"]} />
              <Bar dataKey="revenue" fill="#116089" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <p className="text-sm font-medium text-ink mb-4">Department distribution</p>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={deptData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3}>
                {deptData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="p-5">
        <p className="text-sm font-medium text-ink mb-4">Appointments this week</p>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={APPT_TREND}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef2f6" />
            <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
            <Tooltip />
            <Line type="monotone" dataKey="appts" stroke="#0d9488" strokeWidth={2.5} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
