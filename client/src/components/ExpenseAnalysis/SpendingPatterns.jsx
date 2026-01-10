const SpendingPatterns = ({ patterns }) => {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold mb-4">
        Spending Patterns Detected
      </h2>

      <ul className="list-disc list-inside text-gray-700 space-y-2">
        {patterns.map((pattern, index) => (
          <li key={index}>{pattern}</li>
        ))}
      </ul>
    </div>
  );
};

export default SpendingPatterns;
