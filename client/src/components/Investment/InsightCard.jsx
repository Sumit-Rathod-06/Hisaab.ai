export default function InsightCard({ title, message, type = "info" }) {
  const styles = {
    info: "border-blue-200 bg-blue-50 text-blue-900",
    success: "border-emerald-200 bg-emerald-50 text-emerald-900",
    warning: "border-yellow-200 bg-yellow-50 text-yellow-900",
    alert: "border-red-200 bg-red-50 text-red-900",
  };

  return (
    <div
      className={`rounded-xl border p-6 transition hover:shadow-md ${styles[type]}`}
    >
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm leading-relaxed">{message}</p>
    </div>
  );
}
