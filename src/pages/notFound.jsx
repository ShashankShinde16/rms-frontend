import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const NotFound = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center px-4">
            {/* Animated 404 */}
            <motion.h1
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="text-9xl font-extrabold text-gray-800"
            >
                404
            </motion.h1>

            {/* Subheading */}
            <motion.h2
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-2xl md:text-3xl font-semibold text-gray-700 mb-4"
            >
                Page Not Found
            </motion.h2>

            {/* Description */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-gray-500 mb-8 max-w-xl"
            >
                Oops! The page you're looking for doesn’t exist or has been moved. Let’s get you back to where you belong.
            </motion.p>

            {/* Button */}
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.4 }}
            >
                <Link
                    to="/"
                    className="px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition"
                >
                    Go to Home
                </Link>
            </motion.div>

            {/* Optional Decorative SVG */}
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 0.1 }}
                transition={{ delay: 0.8, duration: 1 }}
                className="absolute bottom-0 left-0 right-0 opacity-10 pointer-events-none"
            >
                <svg viewBox="0 0 1440 320" className="w-full">
                    <path
                        fill="#000000"
                        fillOpacity="1"
                        d="M0,160L80,138.7C160,117,320,75,480,90.7C640,107,800,181,960,208C1120,235,1280,213,1360,202.7L1440,192L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
                    ></path>
                </svg>
            </motion.div>
        </div>
    );
};

export default NotFound;
