const CategoryBreakdown = ({ categories }) => {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold mb-4">
        Expense Breakdown
      </h2>

      <div className="space-y-3">
        {categories.map((item, index) => (
          <div key={index} className="flex justify-between">
            <span className="text-gray-600">{item.category}</span>
            <span className="font-semibold">₹{item.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryBreakdown;
