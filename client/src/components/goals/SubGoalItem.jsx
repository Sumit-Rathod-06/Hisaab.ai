export default function SubGoalItem({ subGoal, onToggle }) {
  return (
    <label className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 cursor-pointer">
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={subGoal.completed}
          onChange={onToggle}
          className="w-4 h-4 accent-green-500"
        />
        <span
          className={`text-sm ${
            subGoal.completed ? "line-through text-gray-400" : ""
          }`}
        >
          {subGoal.title}
        </span>
      </div>

      <span className="text-sm font-medium text-gray-600">
        ₹{subGoal.amount}
      </span>
    </label>
  );
}
