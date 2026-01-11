import InvestmentOverview from "../components/Investment/InvestmentOverview";
import AssetAllocation from "../components/Investment/AssetAllocation";
import InvestmentHoldings from "../components/Investment/InvestmentHoldings";
import AIInvestmentInsights from "../components/Investment/AIInvestmentInsights";
import GoalAlignment from "../components/Investment/GoalAlignment";
import AddInvestment from "../components/Investment/AddInvestment";


export default function InvestmentPage() {
  return (
    <div className="w-full min-h-screen bg-white px-6 md:px-12 py-10 space-y-20">
      
      {/* Page Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
          Investments
        </h1>
        <p className="mt-2 text-slate-600 max-w-2xl">
          Track, analyze, and optimize your investments with AI-driven insights.
        </p>
      </div>

      {/* Sections */}
      <AddInvestment />
      <InvestmentOverview />
      <AssetAllocation />
      <InvestmentHoldings />
      <AIInvestmentInsights />
      <GoalAlignment />
      
      

    </div>
  );
}
