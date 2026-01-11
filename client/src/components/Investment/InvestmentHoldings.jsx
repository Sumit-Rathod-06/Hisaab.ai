import { useState } from "react";
import InvestmentStatusBadge from "./InvestmentStatusBadge";

export default function InvestmentHoldings() {
  const investments = [
    {
      name: "Axis Bluechip Fund",
      type: "Mutual Fund",
      invested: "₹1,50,000",
      current: "₹1,78,000",
      returns: "+18.6%",
      status: "healthy",
    },
    {
      name: "Reliance Industries",
      type: "Equity",
      invested: "₹1,00,000",
      current: "₹1,12,000",
      returns: "+12.0%",
      status: "review",
    },
    {
      name: "PPF Account",
      type: "Fixed Income",
      invested: "₹80,000",
      current: "₹86,000",
      returns: "+7.5%",
      status: "healthy",
    },
    {
      name: "Small Cap Fund",
      type: "Mutual Fund",
      invested: "₹90,000",
      current: "₹74,000",
      returns: "-17.8%",
      status: "risky",
    },
  ];

  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filteredInvestments = investments.filter((item) => {
    const matchesType =
      typeFilter === "All" || item.type === typeFilter;

    const matchesStatus =
      statusFilter === "All" || item.status === statusFilter;

    const matchesSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesType && matchesStatus && matchesSearch;
  });

  return (
    <section className="w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-semibold text-slate-900">
          Investment Holdings
        </h2>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Search investment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option>All</option>
            <option>Equity</option>
            <option>Mutual Fund</option>
            <option>Fixed Income</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="All">All Status</option>
            <option value="healthy">Healthy</option>
            <option value="review">Review</option>
            <option value="risky">Risky</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="text-left px-5 py-3 font-medium">Investment</th>
              <th className="text-left px-5 py-3 font-medium">Type</th>
              <th className="text-right px-5 py-3 font-medium">Invested</th>
              <th className="text-right px-5 py-3 font-medium">Current</th>
              <th className="text-right px-5 py-3 font-medium">Returns</th>
              <th className="text-center px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredInvestments.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="px-5 py-8 text-center text-slate-500"
                >
                  No investments match your filters.
                </td>
              </tr>
            ) : (
              filteredInvestments.map((item) => (
                <tr
                  key={item.name}
                  className="border-t hover:bg-slate-50 transition"
                >
                  <td className="px-5 py-4 font-medium text-slate-900">
                    {item.name}
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    {item.type}
                  </td>
                  <td className="px-5 py-4 text-right">
                    {item.invested}
                  </td>
                  <td className="px-5 py-4 text-right">
                    {item.current}
                  </td>
                  <td
                    className={`px-5 py-4 text-right font-medium ${
                      item.returns.startsWith("-")
                        ? "text-red-600"
                        : "text-emerald-600"
                    }`}
                  >
                    {item.returns}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <InvestmentStatusBadge status={item.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
