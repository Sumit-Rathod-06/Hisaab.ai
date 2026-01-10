import { useState } from "react";

export default function GoalCards() {
  const [amount, setAmount] = useState("");
  const [goalName, setGoalName] = useState("");
  const [goalDate, setGoalDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = "http://localhost:5000/api/goals"; // 🔴 change this

  const handleProcess = async () => {
    setError("");

    // Basic validation
    if (!amount || !goalName || !goalDate) {
      setError("Please fill all the fields.");
      return;
    }

    const payload = {
      amount: Number(amount),
      goalName,
      targetDate: goalDate,
    };

    try {
      setLoading(true);

      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to process goal");
      }

      const data = await res.json();
      console.log("Goal processed:", data);

      alert("Goal successfully processed 🚀");

    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: "GOAL AMOUNT",
      subtitle: "Define your target amount clearly",
      gradient: "from-[#FF9F43] to-[#F97316]",
      shadow: "shadow-orange-300/50",
      input: (
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="card-input"
        />
      ),
    },
    {
      title: "GOAL NAME",
      subtitle: "Purpose name of the GOAL",
      gradient: "from-[#6EE7B7] to-[#22C55E]",
      shadow: "shadow-green-300/50",
      input: (
        <input
          type="text"
          placeholder="Ex. Home"
          value={goalName}
          onChange={(e) => setGoalName(e.target.value)}
          className="card-input"
        />
      ),
    },
    {
      title: "GOAL TENURE",
      subtitle: "Set a realistic timeline",
      gradient: "from-[#93C5FD] to-[#3B82F6]",
      shadow: "shadow-blue-300/50",
      input: (
        <input
          type="date"
          value={goalDate}
          onChange={(e) => setGoalDate(e.target.value)}
          className="card-input"
        />
      ),
    },
  ];

  return (
    <>
      <style>
        {`
          .card-input {
            width: 100%;
            background: rgba(255,255,255,0.18);
            border-radius: 0.5rem;
            border: none;
            outline: none;
            color: white;
            font-size: 1rem;
            padding: 0.6rem 0.75rem;
          }

          .card-input::placeholder {
            color: rgba(255,255,255,0.8);
          }

          .card-input::-webkit-calendar-picker-indicator {
            filter: invert(1);
            cursor: pointer;
          }
        `}
      </style>

      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl w-full">
          {cards.map((card, index) => (
            <div
              key={index}
              className={`
                rounded-3xl p-6
                bg-linear-to-br ${card.gradient}
                text-white
                transition-all duration-500
                hover:-translate-y-2
                hover:shadow-2xl ${card.shadow}
              `}
            >
              <h3 className="text-lg font-semibold mb-1">
                {card.title}
              </h3>
              <p className="text-sm text-white/90 mb-6">
                {card.subtitle}
              </p>
              {card.input}
            </div>
          ))}
        </div>

        {/* 🔘 PROCESS BUTTON */}
        <button
          onClick={handleProcess}
          disabled={loading}
          className="
            mt-10 px-10 py-3 rounded-full
            bg-black text-white font-semibold
            hover:bg-slate-900
            transition disabled:opacity-50
          "
        >
          {loading ? "Processing..." : "PROCESS GOAL"}
        </button>

        {/* ❌ Error Message */}
        {error && (
          <p className="mt-4 text-red-500 text-sm">
            {error}
          </p>
        )}
      </div>
    </>
  );
}
