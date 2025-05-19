import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/auth/`;
const API_USER_URL = `${import.meta.env.VITE_API_BASE_URL}/users/`;

const FloatingInput = ({ label, type = "text", value, onChange }) => {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            <div className="mt-1">
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={label}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>
        </div>
    );
};

const ResetPassword = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const navigate = useNavigate();

    const handleSendOtp = async () => {
        try {
            await axios.post(`${API_URL}send-otp`, { email, phone, purpose: "reset" });
            toast.success("OTP sent to your email and phone");
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
        <div className="h-full bg-gray-50">
            <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <img
                        className="mx-auto h-20 w-auto"
                        src="/images/web-Login-Logo.png"
                        alt="rms-ecommerce"
                    />
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Reset Your Password
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        {step === 1 && "Enter your email and phone to receive OTP"}
                        {step === 2 && "Enter the OTP sent to your email and phone"}
                        {step === 3 && "Set your new password"}
                    </p>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                            {step === 1 && (
                                <>
                                    <FloatingInput
                                        label="Email Address"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <FloatingInput
                                        label="Phone Number"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleSendOtp}
                                        className="w-full flex justify-center cursor-pointer py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Send OTP
                                    </button>
                                </>
                            )}

                            {step === 2 && (
                                <>
                                    <FloatingInput
                                        label="OTP"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleVerifyOtp}
                                        className="w-full flex justify-center cursor-pointer py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Verify OTP
                                    </button>
                                </>
                            )}

                            {step === 3 && (
                                <>
                                    <FloatingInput
                                        label="New Password"
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleResetPassword}
                                        className="w-full flex justify-center cursor-pointer py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Reset Password
                                    </button>
                                </>
                            )}

                            <div className="text-center mt-4">
                                <span className="text-sm text-gray-600">Remembered your password? </span>
                                <button
                                    type="button"
                                    onClick={() => navigate("/login")}
                                    className="text-indigo-600 cursor-pointer hover:underline text-sm font-medium"
                                >
                                    Sign in
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                <Toaster />
            </div>
        </div>
    );
};

export default ResetPassword;
