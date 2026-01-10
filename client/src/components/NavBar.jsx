import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, DollarSign } from "lucide-react";
import { cn } from "../lib/utils";
import { Menu as NavMenu, MenuItem, ProductItem, HoveredLink } from "./ui/navbar-menu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [active, setActive] = useState(null);
  const navigate = useNavigate();

  // JWT CHECK
  useEffect(() => {
    const token = localStorage.getItem("token");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsAuthenticated(token);
  }, []);

  return (
    <nav className="bg-white backdrop-blur-md sticky top-0 z-50">
      <div className="px-6 w-full">
        <div className="flex justify-between items-center h-14">

          {/* DESKTOP NAV with logo and hover menus */}
          <div className="hidden lg:flex flex-1 justify-center">
            <NavMenu setActive={setActive}>
              {/* LOGO inside black navbar */}
              <div className="flex items-center gap-2 mr-16">
                <div className="p-1.5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
                  <DollarSign className="w-4 h-4 text-white" strokeWidth={2.5} />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent ">
                  Hisaab.ai
                </span>
              </div>

              <MenuItem setActive={setActive} active={active} item="Features">
                <div className="flex flex-col space-y-4 text-sm">
                  <HoveredLink href="#ingestion">Smart Data Ingestion</HoveredLink>
                  <HoveredLink href="#spending">Spending Intelligence</HoveredLink>
                  <HoveredLink href="#investments">Investment Insights</HoveredLink>
                  <HoveredLink href="#goals">Goal-Driven Planning</HoveredLink>
                </div>
              </MenuItem>

              <MenuItem setActive={setActive} active={active} item="AI Agents">
                <div className="text-sm grid grid-cols-2 gap-10 p-4">
                  <ProductItem
                    title="Expense Analyzer"
                    href="/agents/expense"
                    src="https://via.placeholder.com/140x70/10b981/ffffff?text=Expense"
                    description="Detects overspending patterns and recurring costs"
                  />
                  <ProductItem
                    title="Investment Advisor"
                    href="/agents/investment"
                    src="https://via.placeholder.com/140x70/14b8a6/ffffff?text=Invest"
                    description="Portfolio optimization and risk analysis"
                  />
                  <ProductItem
                    title="Goal Tracker"
                    href="/agents/goals"
                    src="https://via.placeholder.com/140x70/059669/ffffff?text=Goals"
                    description="Track savings and financial milestones"
                  />
                  <ProductItem
                    title="Financial Health"
                    href="/agents/health"
                    src="https://via.placeholder.com/140x70/0d9488/ffffff?text=Health"
                    description="Comprehensive health score and insights"
                  />
                </div>
              </MenuItem>

              <MenuItem setActive={setActive} active={active} item="Dashboard">
                <div className="flex flex-col space-y-4 text-sm">
                  <HoveredLink href="/dashboard">Overview</HoveredLink>
                  <HoveredLink href="/transactions">Transactions</HoveredLink>
                  <HoveredLink href="/analytics">Analytics</HoveredLink>
                  <HoveredLink href="/reports">Reports</HoveredLink>
                </div>
              </MenuItem>

              <MenuItem setActive={setActive} active={active} item="Resources">
                <div className="flex flex-col space-y-4 text-sm">
                  <HoveredLink href="/docs">Documentation</HoveredLink>
                  <HoveredLink href="/blog">Blog</HoveredLink>
                  <HoveredLink href="/api">API</HoveredLink>
                  <HoveredLink href="/support">Support</HoveredLink>
                </div>
              </MenuItem>
            </NavMenu>
          </div>

          {/* MOBILE LOGO */}
          <div className="flex lg:hidden items-center gap-2">
            <div className="p-1.5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
              <DollarSign className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Hisaab.ai
            </span>
          </div>

          {/* AUTH BUTTONS */}
          {!isAuthenticated && (
            <div className="hidden lg:flex gap-3">
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-1.5 text-sm font-medium text-emerald-700 hover:text-emerald-800 transition-colors"
              >
                Log In
              </button>
              <button
                onClick={() => navigate("/register")}
                className="px-4 py-1.5 text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all shadow-sm"
              >
                Get Started
              </button>
            </div>
          )}

          {/* MOBILE ICON */}
          <button
            className="lg:hidden text-emerald-700"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="lg:hidden border-t border-emerald-100 bg-white">
          <div className="px-4 py-3 space-y-1">
            <a href="#features" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-emerald-50">
              Features
            </a>
            <a href="#agents" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-emerald-50">
              AI Agents
            </a>
            <a href="/dashboard" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-emerald-50">
              Dashboard
            </a>
            <a href="/docs" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-emerald-50">
              Resources
            </a>

            {!isAuthenticated && (
              <div className="pt-3 space-y-2 border-t border-emerald-100">
                <button
                  onClick={() => navigate("/login")}
                  className="w-full px-3 py-2 text-emerald-700 border border-emerald-300 rounded-lg hover:bg-emerald-50"
                >
                  Log In
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="w-full px-3 py-2 text-white bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
