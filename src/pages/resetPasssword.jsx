import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const API_URL = `http://localhost:3000/api/v1/auth/`;
const API_USER_URL = `http://localhost:3000/api/v1/users/`;

const ResetPassword = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const navigate = useNavigate();

    const handleSendOtp = async () => {
        try {
            await axios.post(`${API_URL}send-otp`, { email, purpose: "reset" });
            toast.success("OTP sent to your email");
            setStep(2);
        } catch (err) {
            toast.error(err.response?.data?.mssg || "Failed to send OTP");
        }
    };

    const handleVerifyOtp = async () => {
        try {
            await axios.post(`${API_URL}verify-otp`, { email, otp });
            toast.success("OTP verified");
            setStep(3);
        } catch (err) {
            toast.error(err.response?.data?.mssg || "Invalid OTP");
        }
    };

    const handleResetPassword = async () => {
        try {
            await axios.patch(`${API_USER_URL}me`, { email, password: newPassword });
            toast.success("Password reset successful");
            navigate("/login");
        } catch (err) {
            toast.error(err.response?.data?.mssg || "Failed to reset password");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
                <div className="text-center mb-6">
                    <img
                        src="/images/Login-Logo.png"
                        alt="logo"
                        className="h-14 mx-auto mb-4"
                    />
                    <h1 className="text-2xl font-semibold">Reset Your Password</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {step === 1 && "Enter your email to receive OTP"}
                        {step === 2 && "Enter the OTP sent to your email"}
                        {step === 3 && "Set your new password"}
                    </p>
                </div>

                {/* Step 1 - Email */}
                {step === 1 && (
                    <>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={handleSendOtp}
                            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                        >
                            Send OTP
                        </button>
                    </>
                )}

                {/* Step 2 - OTP */}
                {step === 2 && (
                    <>
                        <input
                            type="text"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <button
                            onClick={handleVerifyOtp}
                            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                        >
                            Verify OTP
                        </button>
                    </>
                )}

                {/* Step 3 - New Password */}
                {step === 3 && (
                    <>
                        <input
                            type="password"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                            onClick={handleResetPassword}
                            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
                        >
                            Reset Password
                        </button>
                    </>
                )}

                <p className="mt-6 text-sm text-center text-gray-500">
                    Remembered your password?{" "}
                    <span
                        className="text-blue-600 hover:underline cursor-pointer"
                        onClick={() => navigate("/login")}
                    >
                        Sign in
                    </span>
                </p>

                <Toaster />
            </div>
        </div>
    );
};

export default ResetPassword;
