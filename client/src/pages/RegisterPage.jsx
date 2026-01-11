import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, User, Shield, TrendingUp, DollarSign } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          username,
          email,
          password,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const { token } = response.data;


      // ✅ Redirect to home or login
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* LEFT SECTION - Brand Identity */}
      <div className="hidden md:flex flex-1 flex-col justify-center items-center bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 px-10 relative overflow-hidden">
        {/* Animated background spline elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-400 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-purple-300 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '2s' }}></div>
        </div>

        {/* Floating geometric shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 right-10 w-20 h-20 border-4 border-blue-300/30 rounded-lg rotate-45 animate-bounce" style={{ animationDuration: '3s' }}></div>
          <div className="absolute bottom-32 left-16 w-16 h-16 border-4 border-indigo-300/30 rounded-full animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
          <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-blue-200/20 rounded-lg rotate-12 animate-pulse" style={{ animationDuration: '3.5s' }}></div>
        </div>

        {/* SVG Spline Background Pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: 'rgb(37, 99, 235)', stopOpacity: 0.3 }} />
              <stop offset="100%" style={{ stopColor: 'rgb(79, 70, 229)', stopOpacity: 0.3 }} />
            </linearGradient>
          </defs>
          <path d="M0,100 C150,200 350,0 500,100 L500,00 L0,0 Z" fill="url(#grad1)">
            <animate attributeName="d"
              dur="10s"
              repeatCount="indefinite"
              values="M0,100 C150,200 350,0 500,100 L500,00 L0,0 Z;
                      M0,50 C150,150 350,50 500,150 L500,00 L0,0 Z;
                      M0,100 C150,200 350,0 500,100 L500,00 L0,0 Z"/>
          </path>
          <path d="M0,300 C150,400 350,200 500,300 L500,600 L0,600 Z" fill="url(#grad1)" opacity="0.5">
            <animate attributeName="d"
              dur="8s"
              repeatCount="indefinite"
              values="M0,300 C150,400 350,200 500,300 L500,600 L0,600 Z;
                      M0,350 C150,250 350,350 500,250 L500,600 L0,600 Z;
                      M0,300 C150,400 350,200 500,300 L500,600 L0,600 Z"/>
          </path>
        </svg>

        <div className="flex flex-col items-center text-center max-w-md relative z-10">
          {/* Logo */}
          <div className="bg-linear-to-br from-blue-600 to-indigo-700 p-5 rounded-2xl mb-6 shadow-2xl animate-pulse" style={{ animationDuration: '2s' }}>
            <DollarSign className="w-12 h-12 text-white" strokeWidth={2.5} />
          </div>

          <h1 className="text-5xl font-bold bg-linear-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-3">
            Hisaab.ai
          </h1>

          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Start Your Financial Journey
          </h2>

          <p className="text-gray-600 mb-8 leading-relaxed">
            Join Hisaab.ai to track expenses, analyze spending patterns, and achieve financial goals with AI-powered insights.
          </p>

          <div className="grid grid-cols-2 gap-6 w-full">
            <div className="flex flex-col items-center p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-blue-100 hover:bg-white/80 transition-all">
              <Shield className="w-6 h-6 text-blue-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">Secure Data</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-blue-100 hover:bg-white/80 transition-all">
              <TrendingUp className="w-6 h-6 text-blue-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">Smart Analytics</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SECTION - Register Form */}
      <div className="flex flex-1 justify-center items-center px-6 py-12 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex md:hidden justify-center mb-8">
            <div className="bg-linear-to-br from-blue-600 to-indigo-700 p-4 rounded-xl shadow-lg">
              <DollarSign className="w-8 h-8 text-white" strokeWidth={2.5} />
            </div>
          </div>

          <div className="bg-linear-to-br from-blue-50/50 to-indigo-50/50 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-blue-100">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
              Create Your Account
            </h2>

            <p className="text-gray-600 text-center mb-6">
              Start managing your finances today
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg mb-4 flex items-center gap-2">
                <span className="font-medium">⚠️</span>
                {error}
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>

              {/* USERNAME */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="your_username"
                    className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Create password"
                    className="w-full pl-11 pr-12 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* CONFIRM PASSWORD */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Re-enter password"
                    className="w-full pl-11 pr-12 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-linear-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white py-3 rounded-xl font-semibold shadow-lg shadow-blue-200 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            {/* FOOTER */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <a href="/login" className="text-blue-600 font-semibold hover:text-blue-700 hover:underline transition-colors">
                  Sign In
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
