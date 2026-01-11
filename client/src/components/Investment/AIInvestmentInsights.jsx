import InsightCard from "./InsightCard";

export default function AIInvestmentInsights() {
  const insights = [
    {
      title: "Portfolio Risk Balance",
      message:
        "Your portfolio is moderately aggressive. This suits long-term goals but may cause volatility in the short term.",
      type: "info",
    },
    {
      title: "Underperforming Assets",
      message:
        "1 mutual fund has consistently underperformed its benchmark. Consider reviewing or reallocating.",
      type: "warning",
    },
    {
      title: "Diversification Check",
      message:
        "You are well diversified across asset classes, reducing overall portfolio risk.",
      type: "success",
    },
    {
      title: "Goal Readiness",
      message:
        "Your current investment pace may fall short of your home purchase goal by ₹4–5L.",
      type: "alert",
    },
  ];

  return (
    <section className="w-full">
      <h2 className="text-2xl font-semibold text-slate-900 mb-6">
        AI Investment Insights
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {insights.map((insight, index) => (
          <InsightCard
            key={index}
            title={insight.title}
            message={insight.message}
            type={insight.type}
          />
        ))}
      </div>
    </section>
  );
}
