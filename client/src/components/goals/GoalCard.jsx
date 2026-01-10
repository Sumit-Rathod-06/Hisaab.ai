import SubGoalItem from "./SubGoalItem";

export default function GoalCard({ goal, onUpdate, onDelete }) {
  const toggleSubGoal = (id) => {
    const updatedSubGoals = goal.subGoals.map((sg) =>
      sg.id === id ? { ...sg, completed: !sg.completed } : sg
    );

    const isCompleted = updatedSubGoals.every((sg) => sg.completed);

    if (isCompleted) {
      onDelete(goal.id);
    } else {
      onUpdate({ ...goal, subGoals: updatedSubGoals });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">{goal.name}</h3>
          <p className="text-gray-500 text-sm">
            Target: ₹{goal.amount} • By {goal.date}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {goal.subGoals.map((sg) => (
          <SubGoalItem
            key={sg.id}
            subGoal={sg}
            onToggle={() => toggleSubGoal(sg.id)}
          />
        ))}
      </div>
    </div>
  );
}
