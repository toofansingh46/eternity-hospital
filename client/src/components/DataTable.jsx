import EmptyState from "./EmptyState";
import LoadingSkeleton from "./LoadingSkeleton";

export default function DataTable({ columns, rows, loading, emptyTitle = "No records found", emptyAction }) {
  if (loading) return <LoadingSkeleton rows={6} />;
  if (!rows || rows.length === 0) return <EmptyState title={emptyTitle} action={emptyAction} />;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100">
            {columns.map((col) => (
              <th key={col.key} className="text-left font-medium text-slate-500 px-4 py-3 whitespace-nowrap">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row._id || i} className="border-b border-slate-50 last:border-0 hover:bg-brand-50/40 transition-colors">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 whitespace-nowrap text-slate-700">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
