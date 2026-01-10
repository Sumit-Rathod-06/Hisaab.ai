const TopCategories = ({ categories }) => {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold mb-4">
        Top Spending Categories
      </h2>

      <ul className="space-y-2">
        {categories.map((cat, index) => (
          <li
            key={index}
            className="flex items-center gap-2 text-gray-700"
          >
            <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
              {index + 1}
            </span>
            {cat}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopCategories;
