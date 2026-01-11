export default function InvestmentActions() {
  return (
    <section className="w-full">
      <div
        className="
          rounded-2xl border border-slate-200
          bg-gradient-to-br from-blue-50 to-white
          p-8 md:p-10
          flex flex-col md:flex-row
          md:items-center md:justify-between
          gap-6
        "
      >
        {/* Left Content */}
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 mb-2">
            Ready to optimize your investments?
          </h2>
          <p className="text-slate-600 max-w-xl">
            Take the next step with AI-powered recommendations to rebalance,
            grow, and align your investments with your life goals.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            className="
              px-6 py-3 rounded-lg
              bg-blue-600 text-white
              font-medium
              hover:bg-blue-700
              transition
            "
          >
            Rebalance Portfolio
          </button>

          <button
            className="
              px-6 py-3 rounded-lg
              border border-slate-300
              text-slate-700
              font-medium
              hover:border-blue-500 hover:text-blue-600
              transition
            "
          >
            Increase SIP
          </button>

          <button
            className="
              px-6 py-3 rounded-lg
              bg-white border border-slate-300
              text-slate-700
              font-medium
              hover:shadow-md
              transition
            "
          >
            Talk to AI Advisor
          </button>
        </div>
      </div>
    </section>
  );
}
