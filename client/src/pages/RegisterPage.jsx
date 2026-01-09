import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";
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

      {/* LEFT SECTION */}
      <div className="hidden md:flex flex-1 flex-col justify-center items-center bg-rose-50 px-10">
        <div className="max-w-md text-center">
          <div className="bg-rose-600 p-4 rounded-xl mb-6 shadow-md">
            <span className="text-white text-3xl">✨</span>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Chitrakolam
          </h1>

          <p className="text-gray-700 leading-relaxed">
            Join Chitrakolam and explore the beauty of kolam art —  
            learn patterns, express creativity, and preserve tradition digitally.
          </p>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex flex-1 justify-center items-center px-6 py-12 bg-white">
        <div className="w-full max-w-md bg-rose-50 rounded-xl shadow-lg p-6">

          <h2 className="text-2xl font-semibold text-gray-900 text-center mb-2">
            Create Account
          </h2>

          <p className="text-gray-600 text-center mb-6">
            Start your creative journey today
          </p>

          {error && (
            <div className="bg-red-100 text-red-600 text-sm p-2 rounded mb-4">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>

            {/* USERNAME */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="your_username"
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Create password"
                  className="w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-rose-500"
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

            {/* CONFIRM PASSWORD */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Re-enter password"
                  className="w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-rose-500"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-3 top-3 text-gray-500"
                >
                  {showConfirmPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white py-2 rounded-lg font-medium shadow disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Register"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <a href="/login" className="text-rose-700 font-medium hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
