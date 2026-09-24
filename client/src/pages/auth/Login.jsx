import { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Activity, Mail, Lock, Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { Field, Input } from "../../components/FormField";
import Button from "../../components/Button";

export default function Login() {
  const [email, setEmail] = useState("admin@eternity.com");
  const [password, setPassword] = useState("admin123");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { push } = useToast();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const expired = params.get("expired");

  function validate() {
    const errs = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = "Enter a valid email address";
    if (!password || password.length < 4) errs.password = "Password is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const user = await login(email, password);
      push(`Welcome back, ${user.name.split(" ")[0]}.`, "success");
      navigate("/dashboard");
    } catch (err) {
      push(err.response?.data?.message || "Unable to sign in. Check your credentials.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-canvas">
      <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-brand-900 to-brand-700 p-10 text-white">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-white/10 flex items-center justify-center">
            <Activity className="h-5 w-5" />
          </div>
          <span className="font-display font-semibold text-lg">Eternity</span>
        </div>
        <div>
          <h2 className="font-display font-semibold text-3xl leading-tight max-w-sm">
            One portal for every department, from the front desk to the billing office.
          </h2>
          <p className="text-brand-200 mt-4 max-w-sm">
            Sign in with your staff account to manage patients, appointments and invoices.
          </p>
        </div>
        <p className="text-brand-300 text-sm">Developed by Toofan Singh</p>
      </div>

      <div className="flex items-center justify-center p-6 md:p-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <h1 className="font-display font-semibold text-2xl text-ink mb-1">Welcome back</h1>
          <p className="text-slate-500 text-sm mb-6">Sign in to the Eternity hospital portal.</p>

          {expired && (
            <div className="mb-4 text-sm bg-amber-50 text-amber-700 rounded-lg px-3 py-2">
              Your session expired. Please sign in again.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Email address" error={errors.email} required>
              <div className="relative">
                <Mail className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  type="email"
                  className="pl-9"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@eternity.com"
                />
              </div>
            </Field>
            <Field label="Password" error={errors.password} required>
              <div className="relative">
                <Lock className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  type="password"
                  className="pl-9"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </Field>

            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-xs text-brand-600 hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Sign in
            </Button>
          </form>

          <div className="mt-6 text-xs text-slate-400 bg-slate-50 rounded-lg p-3">
            Demo credentials — Administrator: admin@eternity.com / admin123
          </div>
        </motion.div>
      </div>
    </div>
  );
}
