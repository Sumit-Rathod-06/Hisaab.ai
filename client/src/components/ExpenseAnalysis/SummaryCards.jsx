const SummaryCards = ({ summary }) => {
  const Card = ({ title, amount }) => (
    <div className="bg-white rounded-xl shadow p-5">
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-2xl font-bold text-gray-800">₹{amount}</p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card title="Total Income" amount={summary.totalIncome} />
      <Card title="Total Expense" amount={summary.totalExpense} />
      <Card title="Savings" amount={summary.savings} />
    </div>
  );
};

export default SummaryCards;
