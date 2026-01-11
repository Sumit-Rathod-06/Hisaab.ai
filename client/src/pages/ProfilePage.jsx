import React, { useState, useEffect } from "react";
import axios from "axios";
import ProfileForm from "../components/ProfileForm";
import ProfileDisplay from "../components/ProfileDisplay";
import BASE_URL from "../api/url";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(`${BASE_URL}/api/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setProfile(response.data.data);
        setIsEditing(false);
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setProfile(null);
        setIsEditing(true);
      } else {
        setError(err.response?.data?.message || "Failed to load profile");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (formData) => {
    try {
      setLoading(true);
      setError("");

      let response;

      if (profile) {
        response = await axios.put(
          `${BASE_URL}/api/profile/${userId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        response = await axios.post(
          `${BASE_URL}/api/profile`,
          { userId, ...formData },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      if (response.data.success) {
        setProfile(response.data.data);
        setIsEditing(false);
        setSuccessMessage(response.data.message);
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError("");
  };

  if (loading && !profile && !isEditing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <p className="text-gray-700 text-lg font-semibold">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white via-purple-500 to-pink-500 p-4 md:p-8">
      {/* Page Header */}
      <div className="text-center text-black mb-8">
        <h1 className="text-4xl font-bold mb-2">My Financial Profile</h1>
        <p className="text-lg opacity-90">
          Manage your personal and financial information
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="max-w-4xl mx-auto mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Success Alert */}
      {successMessage && (
        <div className="max-w-4xl mx-auto mb-6 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg">
          {successMessage}
        </div>
      )}

      {/* Main Content */}
      {isEditing ? (
        <div>
          <ProfileForm
            profile={profile}
            onSave={handleSaveProfile}
            loading={loading}
          />
          <button
            onClick={handleCancel}
            className="w-full max-w-4xl mx-68 mt-6 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition transform hover:scale-105"
          >
            Cancel
          </button>
        </div>
      ) : profile ? (
        <ProfileDisplay profile={profile} onEdit={handleEditClick} />
      ) : (
        <div className="max-w-2xl mx-auto bg-blue-50 rounded-lg shadow-lg p-12 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            No Profile Found
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            Create your financial profile to get started
          </p>
          <button
            onClick={handleEditClick}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition transform hover:scale-105"
          >
            Create Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
