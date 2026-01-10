import SummaryCards from "../components/ExpenseAnalysis/SummaryCards";
import CategoryBreakdown from "../components/ExpenseAnalysis/CategoryBreakdown";
import TopCategories from "../components/ExpenseAnalysis/TopCategories";
import OverspendingAlerts from "../components/ExpenseAnalysis/OverspendingAlerts";
import SpendingPatterns from "../components/ExpenseAnalysis/SpendingPatterns";

const ExpenseAnalysisPage = () => {
  // This will later come from backend API
  const data = {
    monthlySummary: {
      totalIncome: 80000,
      totalExpense: 52000,
      savings: 28000,
    },
    categoryBreakdown: [
      { category: "Food", amount: 12000 },
      { category: "Rent", amount: 18000 },
      { category: "Travel", amount: 9000 },
      { category: "Subscriptions", amount: 3000 },
      { category: "Others", amount: 10000 },
    ],
    topCategories: ["Rent", "Food", "Travel"],
    overspending: [
      { category: "Food", spent: 12000, recommended: 8000 },
    ],
    patterns: [
      "High food spending on weekends",
      "Frequent subscription payments",
    ],
  };

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800">
        Expense Analytics
      </h1>

      <SummaryCards summary={data.monthlySummary} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CategoryBreakdown categories={data.categoryBreakdown} />
        <TopCategories categories={data.topCategories} />
      </div>

      <OverspendingAlerts overspending={data.overspending} />
      <SpendingPatterns patterns={data.patterns} />
    </div>
  );
};

export default ExpenseAnalysisPage;
