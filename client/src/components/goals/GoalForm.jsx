import { useState } from "react";
import { v4 as uuid } from "uuid";

export default function GoalForm({ onAddGoal }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  const createSubGoals = (total, endDate) => {
    const start = new Date();
    const end = new Date(endDate);
    const months =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth()) + 1;

    const monthlyAmount = Math.round(total / months);

    return Array.from({ length: months }).map((_, i) => ({
      id: uuid(),
      title: `Month ${i + 1}`,
      amount: monthlyAmount,
      completed: false,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const subGoals = createSubGoals(amount, date);

    onAddGoal({
      id: uuid(),
      name,
      amount,
      date,
      subGoals,
    });

    setName("");
    setAmount("");
    setDate("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-sm p-6"
    >
      <h2 className="text-lg font-semibold mb-4">Create New Goal</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          className="input"
          placeholder="Goal Name (e.g. Home)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          className="input"
          placeholder="Goal Amount ₹"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <input
          type="date"
          className="input"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      <button className="btn-primary mt-4">Create Goal</button>
    </form>
  );
}
