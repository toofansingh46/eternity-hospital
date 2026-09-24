import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Activity,
  Stethoscope,
  ClipboardList,
  Receipt,
  Pill,
  FlaskConical,
  ShieldCheck,
  Users,
  ArrowRight,
} from "lucide-react";

function useCountUp(target, duration = 1400) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let raf;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

const CAPABILITIES = [
  { icon: ClipboardList, title: "Patient Registration", desc: "Capture demographic and medical intake in one guided flow." },
  { icon: Stethoscope, title: "Doctor Directory", desc: "Specializations, schedules and availability at a glance." },
  { icon: Activity, title: "Appointment Scheduling", desc: "Book, confirm and track visits across every department." },
  { icon: Receipt, title: "Billing & Invoicing", desc: "Itemized invoices with automatic tax and discount handling." },
];

const REASONS = [
  "Centralized patient and clinical records",
  "Faster front-desk and billing operations",
  "Doctor availability visible in real time",
  "One connected view from registration to invoice",
];

function Stat({ label, value, suffix = "" }) {
  const count = useCountUp(value);
  return (
    <div>
      <p className="text-3xl md:text-4xl font-display font-bold text-white">
        {count.toLocaleString()}
        {suffix}
      </p>
      <p className="text-brand-200 text-sm mt-1">{label}</p>
    </div>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-canvas">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700">
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.14]"
          viewBox="0 0 1200 600"
          preserveAspectRatio="none"
        >
          <motion.polyline
            points="0,300 150,300 190,220 230,380 270,150 310,300 500,300 540,260 580,340 620,300 1200,300"
            fill="none"
            stroke="white"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2.2, ease: "easeInOut" }}
          />
        </svg>

        <nav className="relative max-w-6xl mx-auto flex items-center justify-between px-6 py-6">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-white/10 flex items-center justify-center">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <span className="font-display font-semibold text-white text-lg">Eternity</span>
          </div>
          <Link
            to="/login"
            className="text-sm text-white/90 hover:text-white border border-white/20 rounded-lg px-4 py-2 hover:bg-white/10 transition-colors"
          >
            Staff Login
          </Link>
        </nav>

        <div className="relative max-w-6xl mx-auto px-6 pt-10 pb-24 md:pt-16 md:pb-32 text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-brand-200 text-sm font-medium tracking-wide mb-4"
          >
            Your IT Healthcare Partner
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display font-bold text-white text-4xl md:text-6xl leading-tight max-w-3xl mx-auto"
          >
            Smart healthcare management, connected end to end
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-brand-100/90 mt-5 max-w-xl mx-auto"
          >
            Eternity brings registration, appointments, doctors and billing into a single,
            efficient, human-centered workspace for hospital staff.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <Link
              to="/login"
              className="inline-flex items-center gap-2 bg-white text-brand-800 font-medium rounded-lg px-6 py-3 hover:bg-brand-50 transition-colors"
            >
              Enter Hospital Portal <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#capabilities"
              className="inline-flex items-center gap-2 border border-white/30 text-white rounded-lg px-6 py-3 hover:bg-white/10 transition-colors"
            >
              Explore System
            </a>
          </motion.div>
        </div>

        <div className="relative max-w-5xl mx-auto px-6 pb-14 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <Stat label="Registered patients" value={4820} />
          <Stat label="Doctors on staff" value={64} />
          <Stat label="Appointments / mo" value={9200} suffix="+" />
          <Stat label="Beds available" value={38} />
        </div>
      </section>

      {/* Capabilities */}
      <section id="capabilities" className="max-w-6xl mx-auto px-6 py-20">
        <div className="max-w-xl mb-10">
          <h2 className="font-display font-semibold text-2xl md:text-3xl text-ink">What Eternity handles for your front desk</h2>
          <p className="text-slate-500 mt-2">The core workflows a hospital uses every day, in one place.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CAPABILITIES.map((c) => (
            <motion.div
              whileHover={{ y: -4 }}
              key={c.title}
              className="bg-white rounded-xl2 border border-slate-100 shadow-card p-6"
            >
              <div className="h-10 w-10 rounded-lg bg-brand-50 flex items-center justify-center mb-4">
                <c.icon className="h-5 w-5 text-brand-600" />
              </div>
              <h3 className="font-medium text-ink">{c.title}</h3>
              <p className="text-sm text-slate-500 mt-1.5">{c.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why Eternity */}
      <section className="bg-white border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-display font-semibold text-2xl md:text-3xl text-ink mb-5">Why hospitals choose Eternity</h2>
            <ul className="space-y-3">
              {REASONS.map((r) => (
                <li key={r} className="flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
                  <span className="text-slate-600">{r}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Users, label: "Unified patient records" },
              { icon: Pill, label: "Pharmacy-ready architecture" },
              { icon: FlaskConical, label: "Lab-ready architecture" },
              { icon: Receipt, label: "Automated billing math" },
            ].map((f) => (
              <div key={f.label} className="bg-canvas rounded-xl2 p-5 border border-slate-100">
                <f.icon className="h-5 w-5 text-brand-600 mb-3" />
                <p className="text-sm font-medium text-ink">{f.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-900 text-brand-200">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="font-display font-semibold text-white">Eternity</p>
            <p className="text-sm text-brand-300">Your IT Healthcare Partner</p>
          </div>
          <p className="text-sm text-brand-400">Developed by Toofan Singh · © {new Date().getFullYear()} Eternity Healthcare</p>
        </div>
      </footer>
    </div>
  );
}
