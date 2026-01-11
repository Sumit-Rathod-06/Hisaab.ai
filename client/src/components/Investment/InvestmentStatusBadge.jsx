export default function InvestmentStatusBadge({ status }) {
  const styles = {
    healthy: "bg-emerald-100 text-emerald-700",
    review: "bg-yellow-100 text-yellow-700",
    risky: "bg-red-100 text-red-700",
  };

  const labels = {
    healthy: "Healthy",
    review: "Review",
    risky: "Risky",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}
