const severityColors = {
  High: "border-red-500 bg-red-50 text-red-800",
  Medium: "border-yellow-500 bg-yellow-50 text-yellow-800",
  Low: "border-green-500 bg-green-50 text-green-800"
};

export default function AlertCard({ alert }) {
  return (
    <div className={`border-l-4 p-5 rounded-xl shadow-sm ${severityColors[alert.severity]}`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">{alert.type}</h3>
        <span className="text-sm font-medium">{alert.severity}</span>
      </div>

      <p className="mb-4">{alert.message}</p>

      <div>
        <p className="font-medium mb-1">Recommendations:</p>
        <ul className="list-disc list-inside space-y-1">
          {alert.recommendations.map((rec, idx) => (
            <li key={idx}>{rec}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
