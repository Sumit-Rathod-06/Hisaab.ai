import { useState } from "react";
import { Target, TrendingUp, Calendar, Plus, Trash2, Check } from "lucide-react";

<<<<<<< HEAD
const GoalPage = () => {
    return (
        <div className="min-h-screen bg-[#dae2ee] py-12">
            <h1 className="text-4xl font-bold text-center text-black mb-8">
                Your Financial Goals
            </h1>
            <GoalCards />
=======
export default function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [showForm, setShowForm] = useState(false);
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
      id: Date.now() + i,
      title: `Month ${i + 1}`,
      amount: monthlyAmount,
      completed: false,
    }));
  };

  const handleSubmit = () => {
    if (!name || !amount || !date) return;
    
    const subGoals = createSubGoals(Number(amount), date);

    setGoals([
      ...goals,
      {
        id: Date.now(),
        name,
        amount: Number(amount),
        date,
        subGoals,
      },
    ]);

    setName("");
    setAmount("");
    setDate("");
    setShowForm(false);
  };

  const toggleSubGoal = (goalId, subGoalId) => {
    setGoals(goals.map(goal => {
      if (goal.id !== goalId) return goal;
      
      const updatedSubGoals = goal.subGoals.map(sg =>
        sg.id === subGoalId ? { ...sg, completed: !sg.completed } : sg
      );
      
      const isCompleted = updatedSubGoals.every(sg => sg.completed);
      
      return isCompleted ? null : { ...goal, subGoals: updatedSubGoals };
    }).filter(Boolean));
  };

  const deleteGoal = (id) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  const getProgress = (goal) => {
    const completed = goal.subGoals.filter(sg => sg.completed).length;
    return Math.round((completed / goal.subGoals.length) * 100);
  };

  const getTotalSaved = (goal) => {
    return goal.subGoals
      .filter(sg => sg.completed)
      .reduce((sum, sg) => sum + sg.amount, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                Financial Goals
              </h1>
              <p className="text-slate-600 mt-2">Track your progress and achieve your dreams</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              <Plus className="w-5 h-5" />
              New Goal
            </button>
          </div>
>>>>>>> 45f75bc9b2c722550578e5c40212909711d349ab
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Goal Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Create New Goal</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Goal Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  placeholder="e.g., Dream Home"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Target Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-slate-500 font-medium">₹</span>
                  <input
                    type="number"
                    className="w-full pl-8 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                    placeholder="50,000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Target Date
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all"
              >
                Create Goal
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-6 py-3 border border-slate-300 rounded-xl font-medium text-slate-700 hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Goals Grid */}
        {goals.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No goals yet</h3>
            <p className="text-slate-600 mb-6">Start by creating your first financial goal</p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all"
            >
              <Plus className="w-5 h-5" />
              Create Your First Goal
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {goals.map((goal) => {
              const progress = getProgress(goal);
              const saved = getTotalSaved(goal);
              
              return (
                <div
                  key={goal.id}
                  className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  {/* Goal Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-1">{goal.name}</h3>
                        <div className="flex items-center gap-4 text-blue-100 text-sm">
                          <span className="flex items-center gap-1">
                            <TrendingUp className="w-4 h-4" />
                            ₹{goal.amount.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(goal.date).toLocaleDateString('en-IN', { 
                              month: 'short', 
                              year: 'numeric' 
                            })}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteGoal(goal.id)}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span className="font-bold">{progress}%</span>
                      </div>
                      <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-white rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-sm text-blue-100">
                        <span>Saved: ₹{saved.toLocaleString()}</span>
                        <span>Remaining: ₹{(goal.amount - saved).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Sub-goals */}
                  <div className="p-6">
                    <h4 className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wide">
                      Monthly Milestones
                    </h4>
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                      {goal.subGoals.map((sg) => (
                        <label
                          key={sg.id}
                          className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all ${
                            sg.completed
                              ? 'bg-green-50 border-2 border-green-200'
                              : 'bg-slate-50 border-2 border-slate-200 hover:border-blue-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                              sg.completed
                                ? 'bg-green-500 border-green-500'
                                : 'border-slate-300'
                            }`}>
                              {sg.completed && <Check className="w-4 h-4 text-white" />}
                            </div>
                            <input
                              type="checkbox"
                              checked={sg.completed}
                              onChange={() => toggleSubGoal(goal.id, sg.id)}
                              className="sr-only"
                            />
                            <span className={`font-medium ${
                              sg.completed
                                ? 'text-green-700 line-through'
                                : 'text-slate-700'
                            }`}>
                              {sg.title}
                            </span>
                          </div>
                          <span className={`font-bold ${
                            sg.completed ? 'text-green-600' : 'text-slate-900'
                          }`}>
                            ₹{sg.amount.toLocaleString()}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}