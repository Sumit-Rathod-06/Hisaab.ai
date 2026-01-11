export default function OverviewStatCard({
  title,
  value,
  subtitle,
  positive = false,
  highlight = false,
}) {
  return (
    <div
      className={`rounded-xl border p-6 bg-white shadow-sm
        ${highlight ? "border-blue-500" : "border-slate-200"}
      `}
    >
      <p className="text-sm text-slate-500">{title}</p>

      <h3
        className={`mt-2 text-2xl font-bold ${
          positive ? "text-emerald-600" : "text-slate-900"
        }`}
      >
        {value}
      </h3>

      <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
    </div>
  );
}
