import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const API_URL = `http://13.200.204.1/api/v1/auth/`;

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
        console.log("Sending OTP to:", email);
        try {
            await axios.post(`${API_URL}send-otp`, { email });
            toast.success("OTP sent to email!");
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
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
                <div className="text-center mb-6">
                    <img
                        src="https://rms-ecommerce.s3.ap-south-1.amazonaws.com/RMS.png"
                        alt="logo"
                        className="h-14 mx-auto mb-4"
                    />
                    <h1 className="text-2xl font-semibold">Create your account</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {step === 1 && "Enter your email to get started"}
                        {step === 2 && "Verify the OTP sent to your email"}
                        {step === 3 && "Set your password and fill in your details"}
                    </p>
                </div>

                {/* Step 1 - Email */}
                {step === 1 && (
                    <>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={handleSendOtp}
                            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                        >
                            Next
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
                            Verify
                        </button>
                    </>
                )}

                {/* Step 3 - Details */}
                {step === 3 && (
                    <>
                        <input
                            type="password"
                            placeholder="Create Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full mb-3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />

                        <input
                            type="text"
                            placeholder="Full Name"
                            value={userDetails.name}
                            onChange={(e) =>
                                setUserDetails({ ...userDetails, name: e.target.value })
                            }
                            className="w-full mb-3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />

                        <input
                            type="text"
                            placeholder="Phone Number"
                            value={userDetails.phone}
                            onChange={(e) =>
                                setUserDetails({ ...userDetails, phone: e.target.value })
                            }
                            className="w-full mb-3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />

                        <input
                            type="text"
                            placeholder="City"
                            value={userDetails.city}
                            onChange={(e) =>
                                setUserDetails({ ...userDetails, city: e.target.value })
                            }
                            className="w-full mb-3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />

                        <input
                            type="text"
                            placeholder="Street"
                            value={userDetails.street}
                            onChange={(e) =>
                                setUserDetails({ ...userDetails, street: e.target.value })
                            }
                            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />

                        <button
                            onClick={handleSignup}
                            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
                        >
                            Create Account
                        </button>
                    </>
                )}

                <p className="mt-6 text-sm text-center text-gray-500">
                    Already have an account?{" "}
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

export default SignUp;
