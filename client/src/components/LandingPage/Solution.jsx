import { useState } from "react";
import {
  BarChart3,
  Heart,
  TrendingUp,
  Target,
  AlertTriangle,
  Lock,
  ArrowRight,
} from "lucide-react";

const solutions = [
  {
    id: "expenses",
    label: "Expense Analytics",
    title: "Track & analyze your expenses",
    description:
      "Automatically categorize spending, detect patterns, and receive smart alerts to stay in control of your money.",
    icon: BarChart3,
    bg: "bg-emerald-50",
  },
  {
    id: "health",
    label: "Financial Health",
    title: "Understand your financial health",
    description:
      "Get a real-time financial health score that evaluates savings, spending, and overall stability.",
    icon: Heart,
    bg: "bg-blue-50",
  },
  {
    id: "invest",
    label: "Investment Insights",
    title: "Make confident investment decisions",
    description:
      "AI-driven portfolio insights that align with your risk tolerance and long-term financial goals.",
    icon: TrendingUp,
    bg: "bg-orange-50",
  },
  {
    id: "goals",
    label: "Goal Planning",
    title: "Plan and achieve life goals",
    description:
      "Create personalized roadmaps with milestones, timelines, and strategies tailored to you.",
    icon: Target,
    bg: "bg-teal-50",
  },
];

const OurSolution = () => {
  const [active, setActive] = useState(solutions[0]);
  const Icon = active.icon;

  return (
    /* OUTER SHADED BACKGROUND */
    <section className="bg-gray-100 py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* INNER CANVAS */}
        <div className="bg-white rounded-3xl px-8 py-14 md:px-14 md:py-20 shadow-sm">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Our Solution
            </h2>
            <p className="mt-4 text-gray-600">
              A unified AI-powered platform to analyze expenses, evaluate
              financial health, optimize investments, and plan goals — all in
              one dashboard.
            </p>
          </div>

          {/* Tabs */}
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            {solutions.map((item) => {
              const TabIcon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActive(item)}
                  className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition
                    ${
                      active.id === item.id
                        ? "bg-black text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  <TabIcon size={16} />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            {/* Left */}
            <div>
              <h3 className="text-2xl md:text-3xl font-semibold text-gray-900">
                {active.title}
              </h3>
              <p className="mt-4 text-gray-600 leading-relaxed">
                {active.description}
              </p>

              <button className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-gray-900 hover:underline">
                Show me more
                <ArrowRight size={16} />
              </button>
            </div>

            {/* Right Visual */}
            <div
              className={`rounded-3xl p-10 border border-black/5 shadow-sm ${active.bg}`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow">
                  <Icon size={22} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">AI Insight</p>
                  <p className="font-semibold text-gray-900">
                    Real-time Financial Analysis
                  </p>
                </div>
              </div>

              <div className="mt-6 bg-white rounded-xl p-6 shadow">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <AlertTriangle className="text-orange-500" size={18} />
                  Overspending Alert
                </div>

                <p className="mt-3 text-2xl font-bold text-gray-900">
                  ₹43,200
                </p>

                <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                  <span>Wallet Protection Enabled</span>
                  <Lock size={16} />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default OurSolution;
