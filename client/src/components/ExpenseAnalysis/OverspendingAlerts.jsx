const OverspendingAlerts = ({ overspending }) => {
  if (overspending.length === 0) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-red-600 mb-4">
        Overspending Alerts
      </h2>

      {overspending.map((item, index) => (
        <div key={index} className="text-red-700">
          ⚠ {item.category}: Spent ₹{item.spent} (Recommended ₹{item.recommended})
        </div>
      ))}
    </div>
  );
};

export default OverspendingAlerts;
