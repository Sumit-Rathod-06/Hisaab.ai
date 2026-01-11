import React, { useState } from 'react';
import {
    LayoutDashboard,
    Receipt,
    Target,
    TrendingUp,
    Settings,
    LogOut,
    Menu,
    X,
    DollarSign,
    Bell
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DashboardLayout = ({ children, activePage = 'dashboard' }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', active: true },
        { icon: Receipt, label: 'Transactions', path: '/transactions' },
        { icon: Target, label: 'Goals', path: '/goalpage' },
        { icon: TrendingUp, label: 'Investments', path: '/investments' },
        { icon: Settings, label: 'Alerts', path: '/alerts' },
        { icon: Settings, label: 'Profile', path: '/profile' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Navigation */}
            <nav className="bg-white border-b border-gray-200 fixed w-full z-30 top-0">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
                            >
                                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg">
                                    <DollarSign className="w-5 h-5 text-white" strokeWidth={2.5} />
                                </div>
                                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                                    Hisaab.ai
                                </span>
                            </div>
                        </div>

                        {/* Right Side - User Actions */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                            >
                                <LogOut size={18} />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Sidebar */}
            <aside
                className={`
          fixed inset-y-0 left-0 z-20 w-64 bg-white border-r border-gray-200 
          transform transition-transform duration-300 ease-in-out lg:translate-x-0 pt-16
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
            >
                <nav className="px-4 py-6 space-y-2">
                    {menuItems.map((item) => (
                        <button
                            key={item.label}
                            onClick={() => navigate(item.path)}
                            className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium
                transition-all duration-200
                ${item.key === activePage
                                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 border border-blue-200'
                                    : 'text-gray-700 hover:bg-gray-50'
                                }
              `}
                        >
                            <item.icon size={20} />
                            {item.label}
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="lg:pl-64 pt-16">
                <div className="p-4 sm:p-6 lg:p-8">
                    {children}
                </div>
            </main>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
};

export default DashboardLayout;
