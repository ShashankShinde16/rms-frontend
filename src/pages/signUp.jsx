import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/auth/`;

const InputField = ({ label, type, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <div className="mt-1">
      <input
        type={type}
        value={value}
        onChange={onChange}
        required
        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />
    </div>
  </div>
);

const SignUp = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [userDetails, setUserDetails] = useState({
    name: "",
    phone: "",
    city: "",
    street: "",
  });

  const navigate = useNavigate();

  const handleSendOtp = async () => {
    try {
      await axios.post(`${API_URL}send-otp`, {
        email,
        phone: userDetails.phone,
        purpose: "signup",
      });
      toast.success("OTP sent to email and phone!");
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.mssg || "Failed to send OTP");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      await axios.post(`${API_URL}verify-otp`, { email, otp });
      toast.success("OTP verified!");
      setStep(3);
    } catch (err) {
      toast.error(err.response?.data?.mssg || "Invalid OTP");
    }
  };

  const handleSignup = async () => {
    try {
      await axios.post(`${API_URL}signup`, {
        email,
        password,
        name: userDetails.name,
        addresses: [
          {
            phone: userDetails.phone,
            city: userDetails.city,
            street: userDetails.street,
          },
        ],
      });
      toast.success("Account created successfully!");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.mssg || "Signup failed");
    }
  };

  return (
    <>
      <div className="h-full bg-gray-50">
        <div className="h-full min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <img
              className="mx-auto h-20 w-auto"
              src="/images/Login-Logo.png"
              alt="rms-ecommerce"
            />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Create your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              {step === 1 && "Enter your email to get started"}
              {step === 2 && "Verify the OTP sent to your email"}
              {step === 3 && "Set your password and details"}
            </p>
          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 space-y-6">
              {step === 1 && (
                <>
                  <InputField
                    label="Email address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <InputField
                    label="Phone Number"
                    type="text"
                    value={userDetails.phone}
                    onChange={(e) =>
                      setUserDetails({ ...userDetails, phone: e.target.value })
                    }
                  />
                  <button
                    onClick={handleSendOtp}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Next
                  </button>
                </>
              )}

              {step === 2 && (
                <>
                  <InputField
                    label="Enter OTP"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                  <button
                    onClick={handleVerifyOtp}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Verify OTP
                  </button>
                </>
              )}

              {step === 3 && (
                <>
                  <InputField
                    label="Full Name"
                    type="text"
                    value={userDetails.name}
                    onChange={(e) =>
                      setUserDetails({ ...userDetails, name: e.target.value })
                    }
                  />
                  <InputField
                    label="City"
                    type="text"
                    value={userDetails.city}
                    onChange={(e) =>
                      setUserDetails({ ...userDetails, city: e.target.value })
                    }
                  />
                  <InputField
                    label="Street"
                    type="text"
                    value={userDetails.street}
                    onChange={(e) =>
                      setUserDetails({ ...userDetails, street: e.target.value })
                    }
                  />
                  <InputField
                    label="Create Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    onClick={handleSignup}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Create Account
                  </button>
                </>
              )}

              <div className="text-center mt-4">
                <span className="text-sm text-gray-600">Already have an account? </span>
                <button
                  onClick={() => navigate("/login")}
                  className="text-indigo-600 hover:underline text-sm font-medium"
                >
                  Sign in
                </button>
              </div>
            </div>
          </div>
        </div>
        <Toaster />
      </div>
    </>
  );
};

export default SignUp;
