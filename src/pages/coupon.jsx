import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import NoResults from "../util/NoFound";
import Cookies from "js-cookie";
import { FaCopy } from "react-icons/fa";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/coupons/`;

const Coupon = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(null);
    const user_token = Cookies.get("user_token");

    const fetchCoupons = async () => {
        try {
            const { data } = await axios.get(API_URL, {
                headers: {
                    Authorization: `Bearer ${user_token}`
                }
            });
            setCoupons(data.getAllCoupons.coupon || []);
        } catch (error) {
            console.error("Failed to fetch coupons:", error.response?.data?.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = (code) => {
        navigator.clipboard.writeText(code);
        setCopied(code);
        setTimeout(() => setCopied(null), 2000);
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[40vh]">
                <div className="w-12 h-12 border-4 border-blue-400 border-dashed rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <>
            <Navbar />

            <div className="px-4 py-6 mt-12">
                <h2 className="text-center text-3xl font-bold mb-8 text-[#466351]">Available Coupons</h2>

                {coupons.length === 0 ? (
                    <>
                        <NoResults />
                        <p className="text-center text-gray-500">No coupons available.</p>
                    </>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {coupons.map((coupon) => (
                            <div
                                key={coupon._id}
                                className="relative border-2 border-dashed border-green-500 rounded-xl bg-white p-5 shadow-md hover:shadow-lg transition"
                            >
                                <div className="flex flex-col gap-2">
                                    <div className="text-sm text-gray-600">Use this code:</div>
                                    <div className="flex items-center justify-between bg-green-100 px-3 py-2 rounded-md">
                                        <span className="font-semibold text-[#466351] tracking-widest">{coupon.code}</span>
                                        <button
                                            onClick={() => handleCopy(coupon.code)}
                                            className="text-green-700 hover:text-[#466351] ml-2"
                                            title="Copy Code"
                                        >
                                            <FaCopy />
                                        </button>
                                    </div>
                                    {copied === coupon.code && (
                                        <p className="text-sm text-green-600 mt-1">Copied!</p>
                                    )}

                                    <p className="mt-3 text-lg text-gray-800 font-medium">
                                        {coupon.discount}% OFF
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Valid until:{" "}
                                        <span className="font-medium">
                                            {new Date(coupon.expires).toLocaleDateString()}
                                        </span>
                                    </p>
                                    <button
                                        className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm"
                                        disabled
                                    >
                                        Use Now
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </>
    );
};

export default Coupon;
