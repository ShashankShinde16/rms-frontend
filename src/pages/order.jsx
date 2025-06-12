import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import axios from "axios";
import Cookies from "js-cookie";

const API_ORDERS_URL = `${import.meta.env.VITE_API_BASE_URL}/orders/all`; // Placeholder

const Order = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState("latest"); // 'latest' | 'oldest'
    const user_token = Cookies.get("user_token");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(API_ORDERS_URL, {
                    headers: {
                        Authorization: `Bearer ${user_token}`,
                    },
                });

                const sortedOrders = response.data.orders.sort(
                    (a, b) => new Date(b.paidAt) - new Date(a.paidAt)
                );

                setOrders(sortedOrders);
            } catch (error) {
                console.warn("API not ready or failed. Using demo orders.", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const handleSortChange = (e) => {
        const value = e.target.value;
        setSortOrder(value);

        const sorted = [...orders].sort((a, b) =>
            value === "latest"
                ? new Date(b.paidAt) - new Date(a.paidAt)
                : new Date(a.paidAt) - new Date(b.paidAt)
        );

        setOrders(sorted);
    };

    return (
        <>
            <Navbar />
            <div className="p-6 mt-16 min-h-screen bg-gray-50">
                <div className="flex justify-between items-center mb-6 max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-[#466351]">Your Orders</h2>
                    <select
                        value={sortOrder}
                        onChange={handleSortChange}
                        className="border rounded px-3 py-2 text-sm text-gray-700 shadow-sm"
                    >
                        <option value="latest">Sort by Latest</option>
                        <option value="oldest">Sort by Oldest</option>
                    </select>
                </div>

                {loading ? (
                    <p className="text-center text-[#466351]">Loading...</p>
                ) : orders.length === 0 ? (
                    <p className="text-center text-[#466351]">No orders found.</p>
                ) : (
                    <div className="grid gap-6 max-w-4xl mx-auto ">
                        {orders.map((order) => (
                            <div
                                key={order._id}
                                className="bg-white shadow-md rounded-xl p-5 overflow-hidden bg-gradient-to-br from-green-50 to-green-100 border border-green-200 hover:shadow-xl transition-all duration-300"
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800">
                                            Order ID: <span className="text-blue-600">{order._id}</span>
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            Placed on: {new Date(order.paidAt).toLocaleString()}
                                        </p>
                                    </div>
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-medium ${order.isDelivered === true
                                            ? "bg-green-100 text-green-700"
                                            : order.isDelivered === false
                                                ? "bg-yellow-100 text-yellow-700"
                                                : "bg-gray-100 text-gray-700"
                                            }`}
                                    >
                                        {order.isDelivered === true ? "Delivered" : "Shipped"}
                                    </span>
                                </div>

                                <div className="divide-y divide-gray-200">
                                    {order.cartItems.map((item, idx) => {
                                        const matchingVariation = item.productId.variations.find(variation =>
                                            variation.sizes.some(size => size._id === item.variationId)
                                        );

                                        return (
                                            <div key={idx} className="flex gap-4 py-4 items-center">
                                                <img
                                                    src={matchingVariation?.images?.[0]}
                                                    alt={item.productId.name}
                                                    className="w-20 h-20 object-cover rounded border"
                                                />
                                                <div>
                                                    <h4 className="text-md font-semibold text-gray-800">{item.productId.name}</h4>
                                                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                                    <p className="text-sm text-gray-600 font-medium">₹{item.price}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="flex justify-end mt-4">
                                    <p className="font-semibold text-lg text-gray-800">
                                        Total: ₹{order.totalOrderPrice}
                                    </p>
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

export default Order;
