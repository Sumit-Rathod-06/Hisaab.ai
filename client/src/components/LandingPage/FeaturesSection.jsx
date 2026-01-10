import React from "react";
import MagicBento from "../ui/MagicBento";

const cards = [
    {
        color: "rgba(255, 255, 255, 0.70)",
        title: "Smart Data Ingestion",
        description:
            "PDF bank & investment statements → clean, structured transactions with auto-categorization.",
        label: "Ingestion",
    },
    {
        color: "rgba(255, 255, 255, 0.70)",
        title: "Spending Intelligence",
        description:
            "Tracks expenses, detects overspending, and highlights recurring & wasteful spends.",
        label: "Spending",
    },
    {
        color: "rgba(255, 255, 255, 0.70)",
        title: "Investment Insights",
        description:
            "Analyzes portfolio allocation, risk balance, and improvement opportunities.",
        label: "Investments",
    },
    {
        color: "rgba(255, 255, 255, 0.70)",
        title: "Goal-Driven Planning",
        description:
            "Plan and track goals like savings, travel, or home purchase with progress visibility.",
        label: "Goals",
    },
    {
        color: "rgba(255, 255, 255, 0.70)",
        title: "Alerts & Nudges",
        description:
            "Context-aware alerts for overspending, goal slippage, and portfolio imbalance.",
        label: "Alerts",
    },
    {
        color: "rgba(255, 255, 255, 0.70)",
        title: "AI Financial Summary",
        description:
            "Clear weekly/monthly summaries explaining what changed and what to do next.",
        label: "Summary",
    },
    {
        color: "rgba(255, 255, 255, 0.70)",
        title: "Financial Health Score",
        description:
            "Single score reflecting liquidity, stability, growth, and risk management.",
        label: "Score",
    },
    {
        color: "rgba(255, 255, 255, 0.70)",
        title: "Multi-Agent AI Core",
        description:
            "Independent AI agents coordinated to analyze, plan, and advise holistically.",
        label: "Agents",
    },
];

const FeaturesSection = () => {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-24 px-6">
            <div className="pointer-events-none absolute inset-0 opacity-60">
                <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-blue-400/15 blur-3xl" />
                <div className="absolute -bottom-40 right-[-80px] h-[520px] w-[520px] rounded-full bg-indigo-400/10 blur-3xl" />
            </div>

            <div className="relative z-10 mx-auto max-w-7xl">
                <div className="mb-10 text-center">
                    <h2 className="text-4xl md:text-5xl font-semibold text-slate-900">
                        Powered by AI Agents
                    </h2>
                    <p className="mt-4 text-base md:text-lg text-slate-600 max-w-2xl mx-auto">
                        A complete financial intelligence system working in harmony to transform your financial future.
                    </p>
                </div>

                <MagicBento
                    className="magic-bento--light"
                    cards={cards}
                    enableSpotlight
                    enableBorderGlow
                    enableTilt
                    enableMagnetism={false}
                    clickEffect={false}
                    enableStars={false}
                    spotlightRadius={310}
                    glowColor="37, 99, 235"
                />
            </div>
        </section>
    );
};

export default FeaturesSection;
