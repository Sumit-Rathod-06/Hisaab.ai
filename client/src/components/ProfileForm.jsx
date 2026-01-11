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
    if (profile) setFormData(profile);
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
    /* PAGE BACKGROUND */
    <div className="bg-white min-h-screen flex items-center justify-center px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-7xl bg-white rounded-2xl shadow-xl px-8 py-8"
      >
        {/* SECTIONS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* PERSONAL INFO */}
          <Section>
            <SectionHeader
              title="Personal information"
              description="Update your personal details."
            />

            <div className="space-y-4">
              <Input
                label="Full name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
              />

              <Input
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />

              <Input
                label="Age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
              />

              <Select
                label="Marital status"
                name="marital_status"
                value={formData.marital_status}
                onChange={handleChange}
                options={["single", "married", "divorced", "widowed"]}
              />

              <Input
                label="Dependents"
                name="dependents_count"
                type="number"
                value={formData.dependents_count}
                onChange={handleChange}
              />
            </div>
          </Section>

          {/* EMPLOYMENT */}
          <Section>
            <SectionHeader
              title="Employment & income"
              description="Your professional & income details."
            />

            <div className="space-y-4">
              <Select
                label="Employment type"
                name="employment_type"
                value={formData.employment_type}
                onChange={handleChange}
                options={[
                  "employed",
                  "self-employed",
                  "freelancer",
                  "student",
                  "retired",
                  "unemployed",
                ]}
              />

              <Input
                label="Monthly income"
                name="monthly_income"
                value={formData.monthly_income}
                onChange={handleChange}
              />

              <Select
                label="Income type"
                name="income_type"
                value={formData.income_type}
                onChange={handleChange}
                options={[
                  "salary",
                  "business",
                  "investments",
                  "freelance",
                  "other",
                ]}
              />
            </div>
          </Section>

          {/* FINANCIAL PROFILE */}
          <Section>
            <SectionHeader
              title="Financial profile"
              description="Risk preferences & safeguards."
            />

            <div className="space-y-4">
              <Select
                label="Risk profile"
                name="risk_profile"
                value={formData.risk_profile}
                onChange={handleChange}
                options={["low", "medium", "high"]}
              />

              <Input
                label="Emergency fund"
                name="emergency_fund_amount"
                value={formData.emergency_fund_amount}
                onChange={handleChange}
              />

              <label className="flex items-center gap-3 text-sm text-slate-700 pt-2">
                <input
                  type="checkbox"
                  name="has_insurance"
                  checked={formData.has_insurance}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border border-blue-300 text-blue-600 focus:ring-blue-500"
                />
                Insurance coverage available
              </label>
            </div>
          </Section>
        </div>

        {/* ACTION FOOTER */}
        <div className="flex justify-end mt-8 border-t pt-6">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50 shadow-md"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

/* ---------- UI HELPERS ---------- */

const Section = ({ children }) => (
  <div className="p-6 rounded-xl bg-blue-50 border border-blue-100 h-full">
    {children}
  </div>
);

const SectionHeader = ({ title, description }) => (
  <div className="mb-5">
    <h3 className="text-lg font-semibold text-slate-900 mb-1">
      {title}
    </h3>
    <p className="text-sm text-slate-500">{description}</p>
  </div>
);

/* ---------- INPUTS ---------- */

const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-slate-600 mb-1">
      {label}
    </label>
    <input
      {...props}
      className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
    />
  </div>
);

const Select = ({ label, options, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-slate-600 mb-1">
      {label}
    </label>
    <select
      {...props}
      className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
    >
      <option value="">Select</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o.charAt(0).toUpperCase() + o.slice(1)}
        </option>
      ))}
    </select>
  </div>
);

export default ProfileForm;
