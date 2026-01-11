import GoalProgressCard from "./GoalProgressCard";

export default function GoalAlignment() {
  const goals = [
    {
      name: "Buy a House",
      target: "₹50,00,000",
      timeline: "2032",
      status: "offtrack",
      message:
        "At your current investment rate, you may fall short by approximately ₹4.2L.",
    },
    {
      name: "Retirement",
      target: "₹2,00,00,000",
      timeline: "2055",
      status: "ontrack",
      message:
        "Your investments are well aligned for long-term retirement planning.",
    },
    {
      name: "Vacation Fund",
      target: "₹3,00,000",
      timeline: "2027",
      status: "attention",
      message:
        "Consider increasing monthly investments to stay on track.",
    },
  ];

  return (
    <section className="w-full">
      <h2 className="text-2xl font-semibold text-slate-900 mb-6">
        Goal Alignment
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {goals.map((goal, index) => (
          <GoalProgressCard
            key={index}
            name={goal.name}
            target={goal.target}
            timeline={goal.timeline}
            status={goal.status}
            message={goal.message}
          />
        ))}
      </div>
    </section>
  );
}
