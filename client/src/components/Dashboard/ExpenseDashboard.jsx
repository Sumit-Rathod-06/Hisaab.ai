import React, { useEffect, useState } from 'react';
import {
    TrendingUp,
    Receipt,
    DollarSign,
    AlertCircle,
    ArrowUpRight,
    BarChart3,
    Wallet,
    Flame,
    Award,
    Lightbulb,
    Dot
} from 'lucide-react';
import axios from 'axios';

const ExpenseDashboard = () => {
    const [hoveredPoint, setHoveredPoint] = useState(null);
    const [hoveredSlice, setHoveredSlice] = useState(null);
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");

                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };

                const [expenseRes, txRes] = await Promise.all([
                    axios.get("http://localhost:5000/api/finance/expense", config),
                    axios.get("http://localhost:5000/api/finance/transactions", config),
                ]);

                const expenseData = expenseRes.data;
                const transactions = txRes.data.transactions;

                // --- DAILY SPENDING DERIVATION ---
                const dailyMap = {};
                transactions.forEach(tx => {
                    if (tx.transaction_type === "debit") {
                        dailyMap[tx.date] = (dailyMap[tx.date] || 0) + Number(tx.amount);
                    }
                });

                const dailySpending = Object.entries(dailyMap)
                    .map(([date, amount]) => ({ date, amount }))
                    .sort((a, b) => new Date(a.date) - new Date(b.date));

                setDashboardData({
                    ...expenseData,
                    daily_spending: dailySpending,
                    // normalize keys for frontend
                    insights: expenseData.ai_insights || [],
                    top_3_categories: expenseData.top_3_categories.map(c => c.category),
                });

            } catch (error) {
                console.error("Dashboard fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);



    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (
        !dashboardData ||
        !dashboardData.daily_spending?.length ||
        !dashboardData.category_wise_spending
    ) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-red-600">Failed to load dashboard data</p>
            </div>
        );
    }

    const getCategoryPercentage = (amount) =>
        ((amount / dashboardData.total_expense) * 100).toFixed(1);

    const maxCategory = Math.max(
        ...Object.values(dashboardData.category_wise_spending)
    );

    // Calculate max and min for daily spending chart
    const maxDailySpending = Math.max(...dashboardData.daily_spending.map(d => d.amount));
    const minDailySpending = Math.min(...dashboardData.daily_spending.map(d => d.amount));
    const avgDailySpending = dashboardData.daily_spending.reduce((sum, d) => sum + d.amount, 0) / dashboardData.daily_spending.length;

    // Generate SVG path for line chart
    const generatePath = (data, width, height) => {
        const points = data.map((point, index) => {
            const x = (index / (data.length - 1)) * width;
            const y = height - ((point.amount - minDailySpending) / (maxDailySpending - minDailySpending)) * height;
            return { x, y, amount: point.amount };
        });

        const pathData = points.map((point, index) => {
            if (index === 0) return `M ${point.x} ${point.y}`;

            const prevPoint = points[index - 1];
            const controlX1 = prevPoint.x + (point.x - prevPoint.x) / 3;
            const controlX2 = prevPoint.x + (2 * (point.x - prevPoint.x)) / 3;

            return `C ${controlX1} ${prevPoint.y}, ${controlX2} ${point.y}, ${point.x} ${point.y}`;
        }).join(' ');

        return { pathData, points };
    };

    // Generate pie chart data
    const generatePieChart = () => {
        const total = Object.values(dashboardData.category_wise_spending).reduce((sum, val) => sum + val, 0);
        let currentAngle = -90; // Start from top

        const slices = Object.entries(dashboardData.category_wise_spending).map(([category, amount], index) => {
            const percentage = (amount / total) * 100;
            const angle = (amount / total) * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;

            // Calculate slice path
            const radius = 100;
            const x1 = 150 + radius * Math.cos((startAngle * Math.PI) / 180);
            const y1 = 150 + radius * Math.sin((startAngle * Math.PI) / 180);
            const x2 = 150 + radius * Math.cos((endAngle * Math.PI) / 180);
            const y2 = 150 + radius * Math.sin((endAngle * Math.PI) / 180);
            const largeArc = angle > 180 ? 1 : 0;

            const path = `M 150 150 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

            currentAngle = endAngle;

            const colors = [
                '#2563eb',  // blue-600
                '#4f46e5',  // indigo-600
                '#7c3aed',  // violet-600
                '#3b82f6'   // blue-500
            ];

            // Calculate midpoint angle for pop-out direction
            const midAngle = startAngle + angle / 2;
            const offsetX = 10 * Math.cos((midAngle * Math.PI) / 180);
            const offsetY = 10 * Math.sin((midAngle * Math.PI) / 180);

            return {
                category,
                amount,
                percentage: percentage.toFixed(1),
                path,
                color: colors[index],
                offsetX,
                offsetY
            };
        });

        return slices;
    };

    const pieSlices = generatePieChart();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Expense Dashboard</h1>
                <p className="text-gray-600 mt-1">
                    Track and analyze your spending patterns
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Expense */}
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-white/20 rounded-xl">
                            <DollarSign size={24} />
                        </div>
                        <div className="flex items-center gap-1 text-sm bg-white/20 px-2 py-1 rounded-full">
                            <TrendingUp size={14} />
                            <span>2%</span>
                        </div>
                    </div>
                    <p className="text-white/80 text-sm font-medium">TOTAL EXPENSE</p>
                    <p className="text-3xl font-bold mt-1">
                        ₹{dashboardData.total_expense.toLocaleString()}
                    </p>
                    <p className="text-white/70 text-xs mt-2">vs last 30 days</p>
                </div>

                {/* Transactions */}
                <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-50 rounded-xl">
                            <Receipt size={24} className="text-blue-600" />
                        </div>
                        <BarChart3 size={22} className="text-gray-400" />
                    </div>
                    <p className="text-gray-600 text-sm font-medium">TRANSACTIONS</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                        {dashboardData.expense_count}
                    </p>
                    <p className="text-gray-500 text-xs mt-2">This month</p>
                </div>

                {/* Average Transaction */}
                <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-indigo-50 rounded-xl">
                            <TrendingUp size={24} className="text-indigo-600" />
                        </div>
                        <Wallet size={22} className="text-gray-400" />
                    </div>
                    <p className="text-gray-600 text-sm font-medium">AVG TRANSACTION</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                        ₹{dashboardData.average_transaction_value}
                    </p>
                    <p className="text-gray-500 text-xs mt-2">Per expense</p>
                </div>

                {/* Highest Expense */}
                <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-red-50 rounded-xl">
                            <AlertCircle size={24} className="text-red-600" />
                        </div>
                        <Flame size={22} className="text-red-500" />
                    </div>
                    <p className="text-gray-600 text-sm font-medium">HIGHEST EXPENSE</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                        ₹{dashboardData.highest_single_expense.amount.toLocaleString()}
                    </p>
                    <p className="text-gray-500 text-xs mt-2">
                        {dashboardData.highest_single_expense.category}
                    </p>
                </div>
            </div>

            {/* Daily Spending Line Graph */}
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Daily Spending Trend</h2>
                        <p className="text-sm text-gray-500 mt-1">Last {dashboardData.daily_spending.length} days activity</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-600">Average Daily</p>
                        <p className="text-2xl font-bold text-blue-600">₹{Math.round(avgDailySpending)}</p>
                    </div>
                </div>

                <div className="relative pl-16">
                    {/* Chart Container */}
                    <div className="w-full h-80 relative">
                        <svg className="w-full h-full" viewBox="0 0 1000 300" preserveAspectRatio="none">
                            {/* Grid lines */}
                            <defs>
                                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#10b981" />
                                    <stop offset="100%" stopColor="#14b8a6" />
                                </linearGradient>
                                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.05" />
                                </linearGradient>
                            </defs>

                            {/* Horizontal grid lines */}
                            {[0, 1, 2, 3, 4].map((i) => (
                                <line
                                    key={i}
                                    x1="0"
                                    y1={i * 75}
                                    x2="1000"
                                    y2={i * 75}
                                    stroke="#e5e7eb"
                                    strokeWidth="1"
                                />
                            ))}

                            {/* Area under the line */}
                            <path
                                d={`${generatePath(dashboardData.daily_spending, 1000, 280).pathData} L 1000 300 L 0 300 Z`}
                                fill="url(#areaGradient)"
                            />

                            {/* Line path */}
                            <path
                                d={generatePath(dashboardData.daily_spending, 1000, 280).pathData}
                                fill="none"
                                stroke="url(#lineGradient)"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />

                            {/* Data points with hover effects */}
                            {generatePath(dashboardData.daily_spending, 1000, 280).points.map((point, index) => (
                                <g key={index}>
                                    <circle
                                        cx={point.x}
                                        cy={point.y}
                                        r={hoveredPoint === index ? "6" : "4"}
                                        fill="white"
                                        stroke="#10b981"
                                        strokeWidth="2"
                                        className="transition-all cursor-pointer"
                                        onMouseEnter={() => setHoveredPoint(index)}
                                        onMouseLeave={() => setHoveredPoint(null)}
                                    />
                                </g>
                            ))}
                        </svg>

                        {/* Tooltip */}
                        {hoveredPoint !== null && hoveredPoint < dashboardData.daily_spending.length && dashboardData.daily_spending[hoveredPoint] && (
                            <div
                                className="absolute bg-gray-900 text-white px-3 py-2 rounded-lg text-sm font-medium pointer-events-none z-10"
                                style={{
                                    left: `${(hoveredPoint / (dashboardData.daily_spending.length - 1)) * 100}%`,
                                    top: '-40px',
                                    transform: 'translateX(-50%)'
                                }}
                            >
                                <div className="text-center">
                                    <div className="font-bold">₹{dashboardData.daily_spending[hoveredPoint]?.amount || 0}</div>
                                    <div className="text-xs text-gray-300">{dashboardData.daily_spending[hoveredPoint]?.date || ''}</div>
                                </div>
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full border-4 border-transparent border-t-gray-900"></div>
                            </div>
                        )}

                        {/* Y-axis labels */}
                        <div className="absolute -left-16 top-0 h-full flex flex-col justify-between text-xs text-gray-600 text-right pr-2">
                            <span>₹{maxDailySpending}</span>
                            <span>₹{Math.round(maxDailySpending * 0.75)}</span>
                            <span>₹{Math.round(maxDailySpending * 0.5)}</span>
                            <span>₹{Math.round(maxDailySpending * 0.25)}</span>
                            <span>₹{minDailySpending}</span>
                        </div>
                    </div>

                    {/* X-axis labels */}
                    <div className="flex justify-between mt-4 text-xs text-gray-500">
                        {dashboardData.daily_spending.map((day, index) => {
                            // Show every 3rd label to avoid crowding
                            if (index % 3 === 0 || index === dashboardData.daily_spending.length - 1) {
                                return <span key={index}>{day.date}</span>;
                            }
                            return null;
                        })}
                    </div>

                    {/* Stats below chart */}
                    <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
                        <div className="text-center">
                            <p className="text-sm text-gray-600 mb-1">Highest Day</p>
                            <p className="text-xl font-bold text-gray-900">₹{maxDailySpending}</p>
                            <p className="text-xs text-gray-500 mt-1">
                                {dashboardData.daily_spending.find(d => d.amount === maxDailySpending)?.date}
                            </p>
                        </div>
                        <div className="text-center border-x border-gray-200">
                            <p className="text-sm text-gray-600 mb-1">Average</p>
                            <p className="text-xl font-bold text-blue-600">₹{Math.round(avgDailySpending)}</p>
                            <p className="text-xs text-gray-500 mt-1">Daily spending</p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-gray-600 mb-1">Lowest Day</p>
                            <p className="text-xl font-bold text-gray-900">₹{minDailySpending}</p>
                            <p className="text-xs text-gray-500 mt-1">
                                {dashboardData.daily_spending.find(d => d.amount === minDailySpending)?.date}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Category-wise Spending */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900">
                            Category-wise Spending
                        </h2>
                        <button className="text-sm text-blue-600 flex items-center gap-1">
                            View All <ArrowUpRight size={16} />
                        </button>
                    </div>

                    {/* Pie Chart Visualization */}
                    <div className="flex items-center justify-center gap-8">
                        {/* Pie Chart */}
                        <div className="relative">
                            <svg width="300" height="300" viewBox="0 0 300 300">
                                {pieSlices && pieSlices.length > 0 && pieSlices.map((slice, index) => (
                                    <g
                                        key={slice.category}
                                        style={{
                                            transform: hoveredSlice === index
                                                ? `translate(${slice.offsetX}px, ${slice.offsetY}px)`
                                                : 'translate(0, 0)',
                                            transition: 'transform 0.2s ease-out'
                                        }}
                                        className="cursor-pointer"
                                        onMouseEnter={() => setHoveredSlice(index)}
                                        onMouseLeave={() => setHoveredSlice(null)}
                                    >
                                        <path
                                            d={slice.path}
                                            fill={slice.color}
                                            stroke="white"
                                            strokeWidth="2"
                                            style={{
                                                filter: hoveredSlice === index ? 'brightness(1.1) drop-shadow(0 4px 6px rgba(0,0,0,0.15))' : 'none',
                                                transition: 'filter 0.2s ease-out'
                                            }}
                                        />
                                    </g>
                                ))}

                                {/* Center circle for donut effect */}
                                <circle
                                    cx="150"
                                    cy="150"
                                    r="60"
                                    fill="white"
                                />

                                {/* Center text */}
                                <text
                                    x="150"
                                    y="145"
                                    textAnchor="middle"
                                    className="text-sm fill-gray-600 font-medium"
                                >
                                    Total
                                </text>
                                <text
                                    x="150"
                                    y="165"
                                    textAnchor="middle"
                                    className="text-xl fill-gray-900 font-bold"
                                >
                                    ₹{dashboardData.total_expense.toLocaleString()}
                                </text>
                            </svg>

                            {/* Pie Chart Tooltip */}
                            {hoveredSlice !== null && pieSlices[hoveredSlice] && (
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20">
                                    <div className="bg-gray-900 text-white px-4 py-3 rounded-lg shadow-xl">
                                        <div className="text-center">
                                            <div className="text-xs text-gray-300 mb-1">{pieSlices[hoveredSlice].category}</div>
                                            <div className="font-bold text-lg">₹{pieSlices[hoveredSlice].amount?.toLocaleString() || 0}</div>
                                            <div className="text-xs text-gray-400 mt-1">{pieSlices[hoveredSlice].percentage}% of total</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Legend */}
                        <div className="space-y-3">
                            {pieSlices && pieSlices.length > 0 && pieSlices.map((slice) => (
                                <div key={slice.category} className="flex items-center gap-3">
                                    <div
                                        className="w-4 h-4 rounded-full"
                                        style={{ backgroundColor: slice.color }}
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between gap-4">
                                            <span className="font-medium text-gray-700">{slice.category}</span>
                                            <span className="text-sm text-gray-500">{slice.percentage}%</span>
                                        </div>
                                        <div className="text-sm font-bold text-gray-900">
                                            ₹{slice.amount?.toLocaleString() || 0}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Insights - Chatbot Style */}
                    <div className="mt-6 relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-400/20 via-indigo-400/20 to-purple-400/20 backdrop-blur-xl border border-blue-200/50 shadow-lg">
                        {/* Glass effect overlay */}
                        <div className="absolute inset-0 bg-white/40 backdrop-blur-md"></div>

                        <div className="relative z-10 p-6">
                            {/* Header */}
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-blue-300/30">
                                <div className="p-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full shadow-lg">
                                    <Lightbulb size={18} className="text-white" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">AI Insights</h2>
                                    <p className="text-xs text-blue-700">Powered by Hisaab.ai</p>
                                </div>
                            </div>

                            {/* Chat Messages */}
                            <div className="space-y-3">
                                {dashboardData.insights.map((insight, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-3 animate-fade-in"
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        {/* Avatar */}
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
                                            <span className="text-white text-xs font-bold">AI</span>
                                        </div>

                                        {/* Message Bubble */}
                                        <div className="flex-1 bg-white/70 backdrop-blur-sm rounded-2xl rounded-tl-none p-4 shadow-md border border-blue-100/50 hover:bg-white/80 transition-all duration-200">
                                            <p className="text-sm text-gray-800 leading-relaxed">{insight}</p>
                                            <div className="flex items-center gap-2 mt-2 text-xs text-blue-600">
                                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                                                <span>Just now</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Top Categories */}
                    <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">
                            Top Categories
                        </h2>
                        <div className="space-y-3">
                            {dashboardData.top_3_categories.map((category, index) => {
                                const amount =
                                    dashboardData.category_wise_spending[category];
                                const medalColors = [
                                    'text-amber-500',
                                    'text-gray-400',
                                    'text-orange-500'
                                ];

                                return (
                                    <div
                                        key={category}
                                        className="flex items-center justify-between p-4 rounded-xl border border-gray-100"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Award
                                                size={20}
                                                className={medalColors[index]}
                                            />
                                            <div>
                                                <p className="font-semibold text-gray-900">
                                                    {category}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {getCategoryPercentage(amount)}% of total
                                                </p>
                                            </div>
                                        </div>
                                        <p className="font-bold text-gray-900">
                                            ₹{amount.toLocaleString()}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>


                </div>
            </div>
        </div>
    );
};

export default ExpenseDashboard;
