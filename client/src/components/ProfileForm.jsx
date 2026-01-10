import React, { useState, useEffect } from "react";

const ProfileForm = ({ profile, onSave, loading }) => {
  const [formData, setFormData] = useState({
    full_name: "",
    age: "",
    city: "",
    employment_type: "",
    monthly_income: "",
    income_type: "",
    emergency_fund_amount: "",
    has_insurance: false,
    risk_profile: "medium",
    marital_status: "single",
    dependents_count: 0,
  });

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto"
    >
      {/* Personal Information Section */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-blue-500">
          Personal Information
        </h3>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Full Name
          </label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            placeholder="Enter your full name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Age
            </label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="Enter your age"
              min="18"
              max="120"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              City
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Enter your city"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Marital Status
            </label>
            <select
              name="marital_status"
              value={formData.marital_status}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            >
              <option value="single">Single</option>
              <option value="married">Married</option>
              <option value="divorced">Divorced</option>
              <option value="widowed">Widowed</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Number of Dependents
            </label>
            <input
              type="number"
              name="dependents_count"
              value={formData.dependents_count}
              onChange={handleChange}
              min="0"
              max="10"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
        </div>
      </div>

      {/* Employment & Income Section */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-blue-500">
          Employment & Income
        </h3>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Employment Type
          </label>
          <select
            name="employment_type"
            value={formData.employment_type}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          >
            <option value="">Select employment type</option>
            <option value="employed">Employed</option>
            <option value="self-employed">Self-Employed</option>
            <option value="freelancer">Freelancer</option>
            <option value="student">Student</option>
            <option value="retired">Retired</option>
            <option value="unemployed">Unemployed</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Monthly Income
            </label>
            <input
              type="number"
              name="monthly_income"
              value={formData.monthly_income}
              onChange={handleChange}
              placeholder="Enter monthly income"
              step="0.01"
              min="0"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Income Type
            </label>
            <select
              name="income_type"
              value={formData.income_type}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            >
              <option value="">Select income type</option>
              <option value="salary">Salary</option>
              <option value="business">Business Income</option>
              <option value="investments">Investments</option>
              <option value="freelance">Freelance</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Financial Profile Section */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-blue-500">
          Financial Profile
        </h3>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Risk Profile
          </label>
          <select
            name="risk_profile"
            value={formData.risk_profile}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          >
            <option value="low">Low Risk (Conservative)</option>
            <option value="medium">Medium Risk (Balanced)</option>
            <option value="high">High Risk (Aggressive)</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Emergency Fund Amount
            </label>
            <input
              type="number"
              name="emergency_fund_amount"
              value={formData.emergency_fund_amount}
              onChange={handleChange}
              placeholder="Enter emergency fund amount"
              step="0.01"
              min="0"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div className="flex items-end">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="has_insurance"
                checked={formData.has_insurance}
                onChange={handleChange}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="ml-3 text-gray-700 font-semibold">
                Have Insurance
              </span>
            </label>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition transform hover:scale-105 disabled:cursor-not-allowed"
      >
        {loading ? "Saving..." : "Save Profile"}
      </button>
    </form>
  );
};

export default ProfileForm;
