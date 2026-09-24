export default function LoadingSkeleton({ rows = 4 }) {
  return (
    <div className="p-4 space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-10 rounded-lg bg-slate-100 animate-pulse" style={{ animationDelay: `${i * 60}ms` }} />
      ))}
    </div>
  );
}
