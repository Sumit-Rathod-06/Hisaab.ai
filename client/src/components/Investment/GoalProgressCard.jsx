export default function GoalProgressCard({
  name,
  target,
  timeline,
  status,
  message,
}) {
  const statusLabel = {
    ontrack: "On Track",
    attention: "Needs Attention",
    offtrack: "Off Track",
  };

  const statusTextColor = {
    ontrack: "text-emerald-600",
    attention: "text-yellow-600",
    offtrack: "text-red-600",
  };

  return (
    <div
      className="
        rounded-xl border border-slate-200
        bg-[#fafafa]
        p-6 transition-all duration-300
        hover:border-blue-500 hover:shadow-md
      "
    >
      <h3 className="font-semibold text-lg text-slate-900 mb-1">
        {name}
      </h3>

      <div className="text-sm text-slate-600 mb-3">
        <p>
          Target: <strong className="text-slate-800">{target}</strong>
        </p>
        <p>
          Timeline: <strong className="text-slate-800">{timeline}</strong>
        </p>
      </div>

      <span
        className={`inline-block mb-3 px-3 py-1 text-xs font-medium rounded-full bg-white border ${statusTextColor[status]}`}
      >
        {statusLabel[status]}
      </span>

      <p className="text-sm text-slate-700 leading-relaxed">
        {message}
      </p>
    </div>
  );
}
