import React, { useState } from "react";
import { FaTimes, FaEdit, FaCheck, FaArrowLeft } from "react-icons/fa";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";
import Cookies from "js-cookie";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}`;

const ProfilePopup = ({ me, onClose, fetchUser }) => {
  const user = me;
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ ...user });
  const [loading, setLoading] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [phone, setPhone] = useState(formData.addresses[0].phone);
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const sendOtp = async () => {
    if (!phone) return toast.error("Please enter a phone number");

    try {
      await axios.post(`${API_URL}/auth/send-otp`, {
        email: me.email,  // Assuming user email is in `me`
        phone,
        purpose: "verify-phone",
      });

      toast.success("OTP sent successfully");
      setIsOtpSent(true);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to send OTP");
    }
  };

  const verifyOtp = async () => {
    if (!otp) return toast.error("Enter OTP to verify");

    setIsVerifying(true);
    try {
      const { data } = await axios.post(`${API_URL}/auth/verify-otp`, {
        email: me.email,
        otp,
      });

      toast.success("Phone verified successfully!");
      setIsPhoneVerified(true);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "OTP verification failed");
    } finally {
      setIsVerifying(false);
    }
  };


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleAddressChange = (field, value) => {
    const updated = [...formData.addresses];
    updated[0][field] = value;
    setFormData({ ...formData, addresses: updated });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const user_token = Cookies.get("user_token");

      await axios.put(
        `${API_URL}/users/me`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user_token}`,
          },
        }
      );
      fetchUser();
      setTimeout(() => {
        toast.success("Profile updated successfully!");
        setEditMode(false);
        setIsPhoneVerified(false);
        setIsOtpSent(false);
        setOtp("");
      }, 2000);
    } catch (err) {
      console.error("Update failed:", err.response?.data || err.message);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1800);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm transition-all">
      <Toaster />
      <div className="relative profile-scrollbar w-[90%] sm:w-full max-w-md max-h-[90vh] overflow-y-auto p-6 sm:p-8 bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg ring-1 ring-gray-200 transition-transform animate-fade-in-up">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
        >
          <FaTimes size={18} />
        </button>

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">
            {editMode ? "Edit Profile" : "My Profile"}
          </h2>

          {editMode ? (
            <button
              onClick={() => setEditMode(false)}
              className="flex items-center text-sm text-gray-500 hover:text-green-600"
            >
              <FaArrowLeft className="mr-1" /> Back
            </button>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="flex items-center text-sm text-gray-500 hover:text-green-600"
            >
              <FaEdit className="mr-1" /> Edit
            </button>
          )}
        </div>

        {/* Content */}
        {!editMode ? (
          <div className="space-y-3 text-sm text-gray-700">
            <p><span className="font-medium">Name:</span> {user.name}</p>
            <p><span className="font-medium">Email:</span> {user.email}</p>

            <div className="pt-2">
              <p className="font-medium">Addresses:</p>
              <ul className="list-disc list-inside text-gray-600 pl-3 text-xs">
                <li>
                  {user.addresses[0].street}, {user.addresses[0].city} - {user.addresses[0].phone}
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-sm text-gray-700">
            <InputField label="Name" name="name" value={formData.name} onChange={handleChange} />
            <InputField label="Email" name="email" value={formData.email} readOnly onChange={handleChange} />
            <InputField
              type="text"
              name="street"
              label="Street"
              placeholder="Street"
              value={formData.addresses[0].street}
              onChange={(e) => handleAddressChange("street", e.target.value)}
            />
            <InputField
              type="text"
              name="city"
              label="City"
              placeholder="City"
              value={formData.addresses[0].city}
              onChange={(e) => handleAddressChange("city", e.target.value)}
            />
            <div className="space-y-4">
              <InputField
                label="Phone Number"
                name="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              {!isOtpSent ? (
                <button
                  onClick={sendOtp}
                  disabled={loading}
                  className="px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                >
                  {loading ? "Sending OTP..." : "Send OTP"}
                </button>
              ) : (
                <>
                  <InputField
                    label="Enter OTP"
                    name="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                  <button
                    onClick={verifyOtp}
                    disabled={isVerifying}
                    className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                  >
                    {isVerifying ? "Verifying..." : "Verify OTP"}
                  </button>
                </>
              )}
            </div>

          </div>
        )}

        {/* Footer Buttons */}
        {editMode && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={loading || !isPhoneVerified}  // <-- Add check here
              className={`px-5 py-2 rounded-lg text-white transition ${loading || !isPhoneVerified
                ? "bg-green-800 cursor-not-allowed"
                : "bg-green-700 hover:bg-green-800"
                }`}
            >
              {loading ? "Saving..." : (
                <span className="flex items-center">
                  <FaCheck className="mr-2" /> Save
                </span>
              )}
            </button>

          </div>
        )}
      </div>
    </div>
  );
};

const InputField = ({ label, name, value, onChange, readOnly = false }) => (
  <div>
    <label className="block font-medium mb-1">{label}</label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      className={`w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 ${readOnly
        ? "bg-gray-100 cursor-not-allowed"
        : "focus:ring-green-600"
        }`}
    />
  </div>
);

export default ProfilePopup;
