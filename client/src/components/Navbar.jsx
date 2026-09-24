import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, Search, ChevronDown, LogOut, User as UserIcon, Menu } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Navbar({ title, onMenuClick }) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const initials = (user?.name || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="md:hidden text-slate-500">
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="font-display font-semibold text-ink text-lg">{title}</h1>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        <div className="hidden sm:flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2 w-56 border border-slate-100">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            placeholder="Search patients, doctors..."
            className="bg-transparent text-sm outline-none w-full placeholder:text-slate-400"
          />
        </div>

        <button className="relative text-slate-500 hover:text-brand-600">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="relative">
          <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-semibold">
              {initials}
            </div>
            <div className="hidden md:block text-left leading-tight">
              <p className="text-sm font-medium text-ink">{user?.name}</p>
              <p className="text-xs text-slate-400">{user?.role}</p>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.12 }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-cardHover border border-slate-100 py-1"
              >
                <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50">
                  <UserIcon className="h-4 w-4" /> My Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
