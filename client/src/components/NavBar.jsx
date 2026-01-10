import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X, Heart, Pencil } from "lucide-react";

const navLinks = [
  { name: "Explore", to: "/explore" },
  { name: "Analyzer", to: "/analyze" },
  { name: "Generate Kolam", to: "/generate-kolam" },
  { name: "Tutorial Hub", to: "/tutorial" },
  { name: "Canvas", to: "/canvas" },
  { name: "Community", to: "/community" },
  { name: "Profile", to: "/profile" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // ✅ JWT CHECK
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  return (
    <nav className="bg-white border-b shadow-md sticky top-0 z-50">
      <div className="px-6 w-full">
        <div className="flex justify-between items-center h-16">

          {/* LOGO */}
          <div className="flex items-center gap-2">
            <div className="p-1 bg-red-700 rounded-full">
              <Pencil className="w-5 h-5 text-white" fill="white" />
            </div>
            <span className="text-xl font-bold">Chitrakolam</span>
          </div>

          {/* DESKTOP NAV */}
          <div className="hidden lg:flex flex-1 justify-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-medium ${
                    isActive
                      ? "text-red-600"
                      : "text-gray-700 hover:text-red-600"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* AUTH BUTTONS (JWT BASED) */}
          {!isAuthenticated && (
            <div className="hidden lg:flex gap-4">
              <button
                onClick={() => navigate("/register")}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-700 rounded-lg"
              >
                Sign Up
              </button>
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-700 rounded-lg"
              >
                Log In
              </button>
            </div>
          )}

          {/* MOBILE ICON */}
          <button
            className="lg:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="lg:hidden border-t">
          <div className="px-4 py-3 space-y-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md ${
                    isActive
                      ? "bg-red-50 text-red-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}

            {!isAuthenticated && (
              <div className="pt-3 space-y-2 border-t">
                <button
                  onClick={() => navigate("/register")}
                  className="w-full px-3 py-2 text-white bg-red-700 rounded-lg"
                >
                  Sign Up
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="w-full px-3 py-2 text-red-700 border border-red-700 rounded-lg"
                >
                  Log In
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
