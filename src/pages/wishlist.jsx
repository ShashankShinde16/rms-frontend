import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import NoResults from "../util/NoFound";
import Navbar from "../components/Navbar";
import { MdDelete } from "react-icons/md";
import Footer from "../components/Footer";

const API_URL = `http://localhost:3000/api/v1/wishlist/`;

const Wishlist = () => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchWishlist = async () => {
        try {
            const { data } = await axios.get(`${API_URL}`, {
                headers: {
                    Authorization: `Bearer ${Cookies.get("user_token")}`,
                },
            });
            setWishlist(data.getAllUserWishList || []);
        } catch (error) {
            console.error("Failed to fetch wishlist:", error.response?.data?.message);
        } finally {
            setLoading(false);
        }
    };

    const removeFromWishlist = async (productId) => {
        try {
            await axios.delete(`${API_URL}`, {
                headers: {
                    Authorization: `Bearer ${Cookies.get("user_token")}`,
                },
                data: { productId },
            });
            setWishlist((prev) => prev.filter((item) => item._id !== productId));
        } catch (error) {
            console.error("Failed to remove item:", error.response?.data?.message);
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, []);

    if (loading)
        return (
            <div className="flex justify-center items-center min-h-[40vh]">
                <div className="w-12 h-12 border-4 border-blue-400 border-dashed rounded-full animate-spin"></div>
            </div>
        );

    return (
        <>
            <Navbar />

            <div className="px-4 py-6 mt-12">
                <h2 className="text-center text-2xl font-bold mb-6">My Wishlist</h2>

                {wishlist.length === 0 ? (
                    <>
                        <NoResults />
                        <p className="text-center text-gray-500">Your wishlist is empty.</p>
                    </>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {wishlist.map((product) => {
                            const variation = product.variations[0];
                            const size = variation?.sizes[0];
                            const image = variation?.images[0];

                            return (
                                <Link
                                    to={`/product/${product._id}`}
                                    key={product._id}
                                    state={{ product }}
                                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition transform hover:scale-[1.02]">
                                    <img
                                        className="w-full h-[250px] object-cover object-center"
                                        src={image}
                                        alt={product.name}
                                    />
                                    <div className="p-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-semibold text-lg">{product.name}</h3>
                                                <p className="text-gray-700 mt-1">
                                                    <span className="line-through mr-2 text-sm">₹{product.basePrice}</span>
                                                    <span className="font-bold text-green-600 text-md">₹{size?.price}</span>
                                                    <span className="ml-2 bg-red-500 text-white px-2 py-0.5 text-xs rounded">
                                                        -{size?.discount}%
                                                    </span>
                                                </p>
                                            </div>
                                            <button
                                                className="text-3xl mt-3 text-red-500 hover:text-red-700"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    removeFromWishlist(product._id);
                                                }}
                                            >
                                                <MdDelete />
                                            </button>
                                        </div>
                                    </div>

                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>

            <Footer />
        </>
    );

};

export default Wishlist;
