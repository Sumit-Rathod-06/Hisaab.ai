import { useState } from "react";
import DashboardLayout from "../components/Dashboard/DashboardLayout";
import { AlertCircle, Filter, CheckCheck, X, Lightbulb } from "lucide-react";

export default function Alerts() {
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Sample alerts data based on the UX image
  const alertsData = [
    {
      id: 1,
      severity: "high",
      title: "Category Overspending",
      date: "Jan 9, 2026",
      description: "Grocery spending hit ₹5,251 in last month, aligning a total of 60.5% of total expenses.",
      recommendations: [
        'Review "Others" transactions from the last month to identify specific spending patterns.',
        'Set sub "Others" spending to ₹3,687 next month, aligning a total 58% of total expenses.'
      ],
      icon: AlertCircle,
      bgColor: "bg-red-50",
      iconColor: "text-red-600",
      borderColor: "border-red-200"
    },
    {
      id: 2,
      severity: "high",
      title: "Uncategorized Expense Risk",
      date: "Jan 8, 2026",
      description: "Uncategorized expenses total ₹3,251 in last month.",
      recommendations: [
        'Allocate all minimum two weeks to categorize your past "Others" transactions in your expense tracking app.',
        'Set weekly "Others" spending limit of ₹25.20 in your budget to reduce uncategorized expenses.'
      ],
      icon: AlertCircle,
      bgColor: "bg-red-50",
      iconColor: "text-red-600",
      borderColor: "border-red-200"
    },
    {
      id: 3,
      severity: "high",
      title: "Expense Concentration Risk",
      date: "Jan 7, 2026",
      description: "Grocery expenditure exceeding ₹2.5K.",
      recommendations: [
        'Analyze "Others" transactions to identify specific subcategories, aiming to reduce spending by 10% over month.',
        'Allocate an additional ₹50 in your next pay period\'s discretionary spending to reduce uncategorized expenses.'
      ],
      icon: AlertCircle,
      bgColor: "bg-red-50",
      iconColor: "text-red-600",
      borderColor: "border-red-200"
    },
    {
      id: 4,
      severity: "medium",
      title: "Large One-time Expense",
      date: "Jan 6, 2026",
      description: "Single expense of ₹5K+ detected in Others",
      recommendations: [
        'Review the "Others" category transactions to identify the source of the ₹5K+ expense and evaluate if a large is aligned with your budget.',
        'Allocate ₹321 from your next pay period\'s discretionary spending budget, replenishing your emergency fund.'
      ],
      icon: AlertCircle,
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600",
      borderColor: "border-yellow-200"
    }
  ];

  // Calculate counts
  const totalAlerts = alertsData.length;
  const highSeverityCount = alertsData.filter(a => a.severity === "high").length;
  const mediumSeverityCount = alertsData.filter(a => a.severity === "medium").length;

  // Filter alerts based on selected filter
  const filteredAlerts = selectedFilter === "all"
    ? alertsData
    : alertsData.filter(alert => alert.severity === selectedFilter);

  return (
    <DashboardLayout activePage="alerts">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Spending Alerts</h1>
            <p className="text-gray-600 mt-1">
              AI-powered notifications to keep your finances on track
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter size={18} className="text-gray-600" />
              <span className="text-gray-700 font-medium">Filter</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <CheckCheck size={18} />
              <span className="font-medium">Mark All Read</span>
            </button>
          </div>
        </div>

        {/* Alert Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setSelectedFilter("all")}
            className={`p-4 rounded-xl border-2 transition-all ${selectedFilter === "all"
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 bg-white hover:border-gray-300"
              }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <AlertCircle size={24} className="text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="text-sm text-gray-600 font-medium">TOTAL ALERTS</p>
                  <p className="text-2xl font-bold text-gray-900">{totalAlerts}</p>
                </div>
              </div>
            </div>
          </button>

          <button
            onClick={() => setSelectedFilter("high")}
            className={`p-4 rounded-xl border-2 transition-all ${selectedFilter === "high"
              ? "border-red-500 bg-red-50"
              : "border-gray-200 bg-white hover:border-gray-300"
              }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertCircle size={24} className="text-red-600" />
                </div>
                <div className="text-left">
                  <p className="text-sm text-gray-600 font-medium">HIGH SEVERITY</p>
                  <p className="text-2xl font-bold text-gray-900">{highSeverityCount}</p>
                </div>
              </div>
            </div>
          </button>

          <button
            onClick={() => setSelectedFilter("medium")}
            className={`p-4 rounded-xl border-2 transition-all ${selectedFilter === "medium"
              ? "border-yellow-500 bg-yellow-50"
              : "border-gray-200 bg-white hover:border-gray-300"
              }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <AlertCircle size={24} className="text-yellow-600" />
                </div>
                <div className="text-left">
                  <p className="text-sm text-gray-600 font-medium">MEDIUM SEVERITY</p>
                  <p className="text-2xl font-bold text-gray-900">{mediumSeverityCount}</p>
                </div>
              </div>
            </div>
          </button>
        </div>

        {/* Alerts List */}
        <div className="space-y-4">
          {filteredAlerts.map((alert) => {
            const Icon = alert.icon;
            return (
              <div
                key={alert.id}
                className={`bg-white rounded-xl p-6 shadow-sm border-l-4 ${alert.borderColor} hover:shadow-md transition-shadow`}
              >
                {/* Alert Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 ${alert.bgColor} rounded-lg`}>
                      <Icon size={24} className={alert.iconColor} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {alert.title}
                        </h3>
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${alert.severity === "high"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                            }`}
                        >
                          {alert.severity.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{alert.date}</p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <X size={20} />
                  </button>
                </div>

                {/* Alert Description */}
                <p className="text-gray-700 mb-4 ml-16">{alert.description}</p>

                {/* AI Recommendations */}
                <div className={`ml-16 p-4 ${alert.bgColor} rounded-lg`}>
                  <div className="flex items-start gap-2 mb-2">
                    <Lightbulb size={18} className={alert.iconColor} />
                    <p className="font-semibold text-gray-900">AI Recommendations:</p>
                  </div>
                  <ul className="space-y-2">
                    {alert.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className={`mt-1 ${alert.iconColor}`}>✓</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-4 ml-16">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                    View Details
                  </button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                    Dismiss
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredAlerts.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCheck size={32} className="text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No {selectedFilter !== "all" ? selectedFilter + " severity" : ""} alerts
            </h3>
            <p className="text-gray-600">
              You're all caught up! Keep up the great financial management. 🎉
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
