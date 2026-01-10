import React from "react";

const ProfileDisplay = ({ profile, onEdit }) => {
  const getRiskBadgeColor = (risk) => {
    switch (risk) {
      case "low":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const InfoItem = ({ label, value }) => (
    <div className="bg-gray-50 p-4 rounded-lg">
      <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">
        {label}
      </p>
      <p className="text-gray-900 text-lg font-semibold mt-1">{value}</p>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b-2 border-gray-200">
        <h2 className="text-3xl font-bold text-gray-800">
          {profile.full_name || "User Profile"}
        </h2>
        <button
          onClick={onEdit}
          className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition transform hover:scale-105"
        >
          Edit Profile
        </button>
      </div>

      {/* Personal Information */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <InfoItem label="Age" value={profile.age || "Not set"} />
          <InfoItem label="City" value={profile.city || "Not set"} />
          <InfoItem
            label="Marital Status"
            value={
              profile.marital_status
                ? profile.marital_status.charAt(0).toUpperCase() +
                  profile.marital_status.slice(1)
                : "Not set"
            }
          />
          <InfoItem label="Dependents" value={profile.dependents_count || 0} />
        </div>
      </div>

      {/* Employment & Income */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          Employment & Income
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <InfoItem
            label="Employment Type"
            value={
              profile.employment_type
                ? profile.employment_type.charAt(0).toUpperCase() +
                  profile.employment_type.slice(1)
                : "Not set"
            }
          />
          <InfoItem
            label="Monthly Income"
            value={
              profile.monthly_income
                ? `₹${parseFloat(profile.monthly_income).toLocaleString(
                    "en-IN"
                  )}`
                : "Not set"
            }
          />
          <InfoItem
            label="Income Type"
            value={
              profile.income_type
                ? profile.income_type.charAt(0).toUpperCase() +
                  profile.income_type.slice(1)
                : "Not set"
            }
          />
        </div>
      </div>

      {/* Financial Profile */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          Financial Profile
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">
              Risk Profile
            </p>
            <div className="mt-2">
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getRiskBadgeColor(
                  profile.risk_profile
                )}`}
              >
                {profile.risk_profile
                  ? profile.risk_profile.charAt(0).toUpperCase() +
                    profile.risk_profile.slice(1)
                  : "Not set"}
              </span>
            </div>
          </div>
          <InfoItem
            label="Emergency Fund"
            value={
              profile.emergency_fund_amount
                ? `₹${parseFloat(profile.emergency_fund_amount).toLocaleString(
                    "en-IN"
                  )}`
                : "Not set"
            }
          />
          <InfoItem
            label="Insurance"
            value={profile.has_insurance ? "✓ Yes" : "✗ No"}
          />
        </div>
      </div>

      {/* Last Updated */}
      <div className="text-center text-gray-500 text-sm mt-6">
        Last updated:{" "}
        {profile.updated_at
          ? new Date(profile.updated_at).toLocaleDateString()
          : "Never"}
      </div>
    </div>
  );
};

export default ProfileDisplay;
