import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { name: "Products", path: "/admin/products" },
    { name: "Billing & Payments", path: "/admin/billing-payments" },
    { name: "Terms & Offers", path: "/admin/terms-offers" },
    { name: "Users & Contacts", path: "/admin/users-contacts" },
    { name: "Dashboard", path: "/admin/dashboard" },

  ];

  return (
    <div className="w-full bg-black text-white border-b border-gray-700 px-6 py-4 flex justify-between items-center">
      {/* Left */}
      <div className="flex items-center space-x-6">
        <div className="font-bold text-lg">Company Logo</div>

        <nav className="flex space-x-4 text-sm">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`px-3 py-1 rounded ${location.pathname === item.path
                  ? "bg-yellow-600 text-black"
                  : "hover:bg-gray-800"
                }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Right */}
      <div className="flex items-center space-x-4">
        <span className="text-sm">Yash Shah</span>
        <div className="bg-gray-800 rounded px-3 py-1 text-sm cursor-pointer">
          My Profile
        </div>
        <div className="bg-red-600 rounded px-3 py-1 text-sm cursor-pointer">
          Sign Out
        </div>
      </div>
    </div>
  );
};

export default Navbar;
