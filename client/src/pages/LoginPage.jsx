import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { token } = response.data;

      // ✅ Save JWT
      localStorage.setItem("token", token);

      // ✅ Redirect
      navigate(from, { replace: true });
    } catch (err) {
      const message =
        err.response?.data?.message || "Login failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* LEFT SECTION */}
      <div className="hidden md:flex flex-1 flex-col justify-center items-center bg-rose-50 px-10">
        <div className="max-w-md text-center">
          <div className="bg-rose-600 p-4 rounded-xl mb-6 shadow-md">
            <span className="text-white text-3xl">✨</span>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Chitrakolam
          </h1>

          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Discover • Learn • Create Kolam Art
          </h2>

          <p className="text-gray-700 leading-relaxed">
            Bring the timeless beauty of kolam art into the digital world.
            Explore patterns, math, and creativity with modern tools.
          </p>

          <p className="mt-6 text-gray-600 text-sm italic">
            “Join thousands of artists keeping tradition alive.”
          </p>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex flex-1 justify-center items-center px-6 py-12 bg-white">
        <div className="w-full max-w-md bg-rose-50 rounded-xl shadow-lg p-6">

          <h2 className="text-2xl font-semibold text-gray-900 text-center mb-2">
            Welcome Back
          </h2>

          <p className="text-gray-600 text-center mb-6">
            Log in to continue your creative journey
          </p>

          {/* ERROR */}
          {error && (
            <div className="bg-red-100 text-red-600 text-sm p-2 rounded mb-4">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>

            {/* EMAIL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white py-2 rounded-lg font-medium shadow transition disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>

          {/* FOOTER */}
          <p className="text-center text-sm text-gray-600 mt-6">
            New to Chitrakolam?{" "}
            <a
              href="/register"
              className="text-rose-700 font-medium hover:underline"
            >
              Create an account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
