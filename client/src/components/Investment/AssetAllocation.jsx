import { useEffect, useState } from "react";

export default function AssetAllocation() {
  const allocation = [
    { label: "Equity", value: 55, color: "bg-blue-500", glow: "rgba(59,130,246,0.6)" },
    { label: "Mutual Funds", value: 25, color: "bg-indigo-500", glow: "rgba(99,102,241,0.6)" },
    { label: "Fixed Income", value: 15, color: "bg-emerald-500", glow: "rgba(16,185,129,0.6)" },
    { label: "Cash", value: 5, color: "bg-slate-400", glow: "rgba(148,163,184,0.6)" },
  ];

  const [mounted, setMounted] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [mouseX, setMouseX] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="w-full">
      <h2 className="text-2xl font-semibold text-slate-900 mb-6">
        Asset Allocation
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Allocation Bars */}
        <div className="space-y-5">
          {allocation.map((item) => (
            <div
              key={item.label}
              onMouseEnter={() => setHovered(item.label)}
              onMouseLeave={() => setHovered(null)}
              onMouseMove={(e) =>
                setMouseX(
                  e.nativeEvent.offsetX / e.currentTarget.offsetWidth
                )
              }
              className="relative"
            >
              {/* Label */}
              <div className="flex justify-between text-sm text-slate-600 mb-1">
                <span>{item.label}</span>
                <span>{item.value}%</span>
              </div>

              {/* Bar Background */}
              <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden relative">
                
                {/* Bar Fill */}
                <div
                  className={`h-full ${item.color}
                    transition-all duration-700 ease-out
                    ${hovered === item.label ? "scale-y-125 brightness-110" : ""}
                  `}
                  style={{
                    width: mounted ? `${item.value}%` : "0%",
                    boxShadow:
                      hovered === item.label
                        ? `0 0 14px ${item.glow}`
                        : "none",
                    transformOrigin: "center",
                  }}
                />

                {/* Mouse-follow glow */}
                {hovered === item.label && (
                  <div
                    className="absolute top-0 h-full w-10 pointer-events-none"
                    style={{
                      left: `${mouseX * 100}%`,
                      background: `radial-gradient(circle, ${item.glow}, transparent 70%)`,
                      transform: "translateX(-50%)",
                    }}
                  />
                )}
              </div>

              {/* Tooltip */}
              {hovered === item.label && (
                <div className="absolute -top-9 right-0 bg-slate-900 text-white text-xs px-3 py-1 rounded-md shadow">
                  {item.value}% allocated
                </div>
              )}
            </div>
          ))}
        </div>

        {/* AI Insight */}
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
          <h3 className="font-semibold text-blue-900 mb-2">
            AI Insight
          </h3>
          <p className="text-sm text-blue-800 leading-relaxed">
            Your portfolio is equity-heavy. While this supports long-term growth,
            it may increase volatility in the short term. If your goals are
            within the next 3–5 years, consider increasing stable allocations.
          </p>
        </div>

      </div>
    </section>
  );
}
