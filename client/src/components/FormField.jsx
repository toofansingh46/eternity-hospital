export function Field({ label, error, children, required }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-slate-600">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}

const baseInput =
  "w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-ink placeholder:text-slate-400 focus-ring";

export function Input(props) {
  return <input className={baseInput} {...props} />;
}

export function Select({ children, ...props }) {
  return (
    <select className={baseInput} {...props}>
      {children}
    </select>
  );
}

export function Textarea(props) {
  return <textarea className={`${baseInput} min-h-[80px]`} {...props} />;
}
