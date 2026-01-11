import { useEffect, useState } from "react";
import { Target, TrendingUp, Calendar, Plus, Trash2, Check } from "lucide-react";

const API_BASE = "http://localhost:5000/api/goals";

export default function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [purpose, setPurpose] = useState("");
  const [amount, setAmount] = useState("");
  const [months, setMonths] = useState("");
  const [loading, setLoading] = useState(false);
  const [milestoneAmounts, setMilestoneAmounts] = useState({});
  const token = localStorage.getItem("token");
  const updateMilestoneAmount = async (goalId, month, key, amount) => {
    const savedAmount = milestoneAmounts[key];
    if (!savedAmount) return;

    try {
      await fetch("http://localhost:5000/api/finance/milestone", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          goalId,
          savedAmount: Number(savedAmount),
          expectedAmount: Number(amount),
          month
        }),
      });

      await fetchGoals(); // refresh from backend
    } catch (err) {
      console.error("Milestone update error:", err);
    }
  };

  /* ---------------- FETCH GOALS ---------------- */
  const fetchGoals = async () => {
  try {
    const res = await fetch(`${API_BASE}/expense-analysis`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      setGoals([]);
      return;
    }

    const data = await res.json(); // ARRAY

    const normalizedGoals = data.map((g) => ({
      id: g.id,
      name: g.purpose,
      amount: Number(g.amount),
      date: g.created_at,
      feasibility: g.plan?.feasibility,
      recommendations: g.plan?.recommendations || [],
      subGoals: (g.plan?.milestones || []).map((m, idx) => ({
        id: `${g.id}-${idx}`,
        title: `Month ${m.month}`,
        amount: m.target_amount,
        completed: false,
      })),
    }));

    setGoals(normalizedGoals);
  } catch (err) {
    console.error("Fetch goals error:", err);
  }
};


  useEffect(() => {
    fetchGoals();
  }, []);

  /* ---------------- CREATE GOAL ---------------- */
  const handleSubmit = async () => {
    if (!purpose || !amount || !months) return;

    setLoading(true);

    try {
      await fetch(`"http://localhost:5000/api/finance/goal`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          purpose,
          amount: Number(amount),
          months: Number(months),
        }),
      });

      // Refresh goals after POST
      await fetchGoals();

      setPurpose("");
      setAmount("");
      setMonths("");
      setShowForm(false);
    } catch (err) {
      console.error("Create goal error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI HELPERS ---------------- */
  const toggleSubGoal = (goalId, subGoalId) => {
    setGoals(goals.map(goal => {
      if (goal.id !== goalId) return goal;

      return {
        ...goal,
        subGoals: goal.subGoals.map(sg =>
          sg.id === subGoalId
            ? { ...sg, completed: !sg.completed }
            : sg
        ),
      };
    }));
  };

  const getProgress = (goal) =>
    Math.round(
      (goal.subGoals.filter(sg => sg.completed).length /
        goal.subGoals.length) * 100
    );

  const getTotalSaved = (goal) =>
    goal.subGoals
      .filter(sg => sg.completed)
      .reduce((sum, sg) => sum + sg.amount, 0);

  /* ---------------- JSX ---------------- */
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Target /> Financial Goals
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex gap-2"
        >
          <Plus /> New Goal
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl mb-6 shadow">
          <div className="grid grid-cols-3 gap-4">
            <input
              placeholder="Purpose"
              className="border p-2 rounded"
              value={purpose}
              onChange={e => setPurpose(e.target.value)}
            />
            <input
              type="number"
              placeholder="Amount"
              className="border p-2 rounded"
              value={amount}
              onChange={e => setAmount(e.target.value)}
            />
            <input
              type="number"
              placeholder="Months"
              className="border p-2 rounded"
              value={months}
              onChange={e => setMonths(e.target.value)}
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
          >
            {loading ? "Creating..." : "Create Goal"}
          </button>
        </div>
      )}

      {goals.length === 0 ? (
        <p className="text-gray-500">No goals found</p>
      ) : (
        goals.map(goal => {
          const progress = getProgress(goal);
          const saved = getTotalSaved(goal);

          return (
            <div key={goal.id} className="bg-white p-6 rounded-xl shadow mb-6">
              <div className="flex justify-between mb-3">
                <h2 className="text-xl font-bold">{goal.name}</h2>
                <span>₹{goal.amount}</span>
              </div>

              <div className="h-3 bg-gray-200 rounded mb-3">
                <div
                  className="h-full bg-blue-600 rounded"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <p className="mb-4">
                Saved ₹{saved} / ₹{goal.amount}
              </p>

              {goal.subGoals.map((sg, index) => {
                const month = index + 1;
                const key = `${goal.id}-${month}`;

                return (
                  <div
                    key={key}
                    className="flex items-center justify-between p-3 border rounded mb-2"
                  >
                    <div>
                      <p className="font-medium">Month {month}</p>
                      <p className="text-sm text-gray-500">
                        Target ₹{sg.amount}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        className="border px-2 py-1 w-28 rounded"
                        placeholder="Enter amount"
                        value={milestoneAmounts[key] || ""}
                        onChange={(e) =>
                          setMilestoneAmounts({
                            ...milestoneAmounts,
                            [key]: e.target.value,
                          })
                        }
                      />

                      <button
                        onClick={() =>
                          updateMilestoneAmount(goal.id, month, key, sg.amount)
                        }
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Update
                      </button>
                    </div>
                  </div>
                );
              })}


              <div
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-3 ${
                  goal.feasibility === "Feasible"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {goal.feasibility}
              </div>

              {goal.recommendations.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    Recommendations
                  </h3>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
                    {goal.recommendations.map((rec, idx) => (
                      <li key={idx}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}

            </div>
          );
        })
      )}
    </div>
  );
}
