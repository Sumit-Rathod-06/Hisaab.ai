import React, { useState, useMemo } from "react";

const initialTasks = {
  todo: [
    { id: 1, title: "Design landing page", checked: false },
    { id: 2, title: "Create wireframes", checked: false },
  ],
  inProgress: [
    { id: 3, title: "Build Kanban logic", checked: false },
  ],
  done: [{ id: 4, title: "Project setup", checked: true }],
};

export default function KanbanWithProgress() {
  const [tasks, setTasks] = useState(initialTasks);

  const moveTask = (from, to, task) => {
    setTasks((prev) => ({
      ...prev,
      [from]: prev[from].filter((t) => t.id !== task.id),
      [to]: [...prev[to], task],
    }));
  };

  const handleCheck = (column, task) => {
    if (column === "todo") {
      moveTask("todo", "inProgress", { ...task, checked: false });
    } else if (column === "inProgress") {
      moveTask("inProgress", "done", { ...task, checked: true });
    }
  };

  const handleBack = (column, task) => {
    if (column === "inProgress") {
      moveTask("inProgress", "todo", { ...task, checked: false });
    } else if (column === "done") {
      moveTask("done", "inProgress", { ...task, checked: false });
    }
  };

  /* ------------------ Progress Logic ------------------ */
  const totalTasks = useMemo(
    () =>
      tasks.todo.length +
      tasks.inProgress.length +
      tasks.done.length,
    [tasks]
  );

  const doneCount = tasks.done.length;

  const progress = Math.round((doneCount / totalTasks) * 100);

  // 🔮 Preview progress (ghost)
  const previewProgress = useMemo(() => {
    if (tasks.inProgress.length > 0 && doneCount < totalTasks) {
      return Math.round(((doneCount + 1) / totalTasks) * 100);
    }
    return progress;
  }, [tasks.inProgress.length, doneCount, totalTasks, progress]);

  const progressMessage = useMemo(() => {
    if (progress === 100) return "Mission accomplished 🏆";
    if (progress >= 75) return "Woah! Great work 💪";
    if (progress >= 50) return "Yay! 50% done 🎉";
    return "Let’s get started 🚀";
  }, [progress]);

  /* ------------------ Gauge Values ------------------ */
  const radius = 120;
  const circumference = Math.PI * radius;

  const realOffset =
    circumference - (progress / 100) * circumference;

  const previewOffset =
    circumference - (previewProgress / 100) * circumference;

  /* ------------------ Column Component ------------------ */
  const Column = ({ title, color, columnKey }) => (
    <div className="flex-1 rounded-xl bg-white p-4 shadow-md">
      <h3 className="mb-4 text-lg font-semibold" style={{ color }}>
        {title}
      </h3>

      <div className="space-y-3">
        {tasks[columnKey].map((task) => (
          <div
            key={task.id}
            className="flex items-start justify-between gap-3 rounded-lg border p-3"
          >
            <div className="flex items-start gap-3">
              {columnKey !== "done" && (
                <input
                  type="checkbox"
                  checked={task.checked}
                  onChange={() => handleCheck(columnKey, task)}
                  className="mt-1 h-4 w-4"
                />
              )}

              <p
                className={`text-sm ${
                  columnKey === "done"
                    ? "line-through text-gray-400"
                    : "text-gray-800"
                }`}
              >
                {task.title}
              </p>
            </div>

            {columnKey !== "todo" && (
              <button
                onClick={() => handleBack(columnKey, task)}
                className="text-gray-400 hover:text-red-500"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f4f6f5] p-10 text-black">
      <h1 className="mb-10 text-center text-3xl font-bold">
        Kanban Progress Dashboard
      </h1>

      <div className="mx-auto flex max-w-7xl items-start gap-12">
        
        {/* ---------- Kanban Board ---------- */}
        <div className="flex flex-1 gap-6">
          <Column title="To Do" color="#06b6d4" columnKey="todo" />
          <Column title="In Progress" color="#f59e0b" columnKey="inProgress" />
          <Column title="Done" color="#22c55e" columnKey="done" />
        </div>

        {/* ---------- Progress Meter ---------- */}
        <div className="flex w-[320px] flex-col items-center">
          <svg width="300" height="160">
            {/* Background */}
            <path
              d="M30 140 A120 120 0 0 1 270 140"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="18"
            />

            {/* Preview / Ghost Arc */}
            <path
              d="M30 140 A120 120 0 0 1 270 140"
              fill="none"
              stroke="#fde68a"
              strokeWidth="18"
              strokeDasharray={circumference}
              strokeDashoffset={previewOffset}
              style={{ transition: "stroke-dashoffset 0.6s ease" }}
            />

            {/* Real Progress Arc */}
            <path
              d="M30 140 A120 120 0 0 1 270 140"
              fill="none"
              stroke="url(#grad)"
              strokeWidth="18"
              strokeDasharray={circumference}
              strokeDashoffset={realOffset}
              style={{ transition: "stroke-dashoffset 0.6s ease" }}
            />

            {/* Needle */}
            <line
              x1="150"
              y1="140"
              x2={150 + 100 * Math.cos(Math.PI * (1 - progress / 100))}
              y2={140 - 100 * Math.sin(Math.PI * (1 - progress / 100))}
              stroke="#9ca3af"
              strokeWidth="2"
            />

            {/* Percentage */}
            <text
              x="150"
              y="110"
              textAnchor="middle"
              fontSize="32"
              fill="#111827"
              fontWeight="bold"
            >
              {progress}%
            </text>

            <defs>
              <linearGradient id="grad">
                <stop offset="0%" stopColor="#ff6a00" />
                <stop offset="100%" stopColor="#ff3d00" />
              </linearGradient>
            </defs>
          </svg>

          <p className="mt-2 text-sm font-medium text-gray-600">
            {progressMessage}
          </p>
        </div>
      </div>
    </div>
  );
}
