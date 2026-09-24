import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  UserPlus,
  Users,
  Stethoscope,
  CalendarClock,
  Receipt,
  ChevronsLeft,
  ChevronsRight,
  Activity,
} from "lucide-react";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/registration", label: "Registration", icon: UserPlus },
  { to: "/patients", label: "Patients", icon: Users },
  { to: "/doctors", label: "Doctors", icon: Stethoscope },
  { to: "/appointments", label: "Appointments", icon: CalendarClock },
  { to: "/billing", label: "Billing", icon: Receipt },
];

export default function Sidebar({ collapsed, setCollapsed }) {
  return (
    <motion.aside
      animate={{ width: collapsed ? 76 : 240 }}
      transition={{ type: "spring", stiffness: 260, damping: 30 }}
      className="hidden md:flex flex-col bg-brand-900 text-brand-50 h-screen sticky top-0 shrink-0"
    >
      <div className="flex items-center gap-2 px-4 h-16 shrink-0">
        <div className="h-8 w-8 rounded-lg bg-brand-500 flex items-center justify-center shrink-0">
          <Activity className="h-4.5 w-4.5 text-white" />
        </div>
        {!collapsed && (
          <div className="leading-tight">
            <p className="font-display font-semibold text-white text-sm">Eternity</p>
            <p className="text-[10px] text-brand-300">Healthcare Partner</p>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            title={collapsed ? item.label : undefined}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive ? "bg-brand-600 text-white" : "text-brand-200 hover:bg-brand-800 hover:text-white"
              }`
            }
          >
            <item.icon className="h-4.5 w-4.5 shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={() => setCollapsed((c) => !c)}
        className="flex items-center gap-2 px-4 py-4 text-brand-300 hover:text-white text-sm border-t border-brand-800"
      >
        {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
        {!collapsed && "Collapse"}
      </button>
    </motion.aside>
  );
}
