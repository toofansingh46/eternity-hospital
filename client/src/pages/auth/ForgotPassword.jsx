import { useState } from "react";
import { Link } from "react-router-dom";
import { Activity, MailCheck } from "lucide-react";
import { Field, Input } from "../../components/FormField";
import Button from "../../components/Button";

export default function ForgotPassword() {
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas p-6">
      <div className="w-full max-w-sm bg-white rounded-xl2 shadow-card border border-slate-100 p-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="h-8 w-8 rounded-lg bg-brand-600 flex items-center justify-center">
            <Activity className="h-4 w-4 text-white" />
          </div>
          <span className="font-display font-semibold text-ink">Eternity</span>
        </div>

        {sent ? (
          <div className="text-center py-4">
            <MailCheck className="h-10 w-10 text-teal-600 mx-auto mb-3" />
            <p className="font-medium text-ink">Check your email</p>
            <p className="text-sm text-slate-500 mt-1">
              If an account exists for {email}, reset instructions have been sent.
            </p>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
            className="space-y-4"
          >
            <div>
              <h1 className="font-display font-semibold text-xl text-ink">Reset your password</h1>
              <p className="text-sm text-slate-500 mt-1">We'll send reset instructions to your email.</p>
            </div>
            <Field label="Email address" required>
              <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@eternity.com" />
            </Field>
            <Button type="submit" className="w-full">Send reset link</Button>
          </form>
        )}

        <Link to="/login" className="block text-center text-sm text-brand-600 hover:underline mt-6">
          Back to login
        </Link>
      </div>
    </div>
  );
}
