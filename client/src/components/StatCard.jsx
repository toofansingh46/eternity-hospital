import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function useCountUp(target, duration = 900) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let raf;
    const start = performance.now();
    const from = 0;
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(from + (target - from) * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

export default function StatCard({ label, value, icon: Icon, tint = "brand", prefix = "", suffix = "" }) {
  const count = useCountUp(typeof value === "number" ? value : 0);
  const tints = {
    brand: "bg-brand-50 text-brand-600",
    teal: "bg-teal-50 text-teal-600",
    amber: "bg-amber-50 text-amber-600",
    emerald: "bg-emerald-50 text-emerald-600",
    red: "bg-red-50 text-red-600",
  };
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="bg-white rounded-xl2 shadow-card border border-slate-100 p-5 flex items-center gap-4"
    >
      <div className={`h-11 w-11 rounded-lg flex items-center justify-center ${tints[tint]}`}>
        {Icon && <Icon className="h-5 w-5" />}
      </div>
      <div>
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <p className="text-2xl font-display font-semibold text-ink mt-0.5">
          {prefix}
          {typeof value === "number" ? count.toLocaleString() : value}
          {suffix}
        </p>
      </div>
    </motion.div>
  );
}
