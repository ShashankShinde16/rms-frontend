import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import NoResults from "../util/NoFound";

const API_URL = `https://rmsjeans.com/api/v1/brands/`;

const BrandList = () => {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const user_token = Cookies.get("user_token");

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const response = await axios.get(API_URL, {
                    headers: {
                        Authorization: `Bearer ${user_token}`
                    }
                });
                setBrands(response.data.getAllBrands);
            } catch (err) {
                console.error("Error fetching brands:", err);
                setError("Failed to load brands");
            } finally {
                setLoading(false);
            }
        };

        fetchBrands();
    }, []);

    if (loading)
        return (
            <div className="flex justify-center items-center min-h-[40vh]">
                <div className="w-12 h-12 border-4 border-blue-400 border-dashed rounded-full animate-spin"></div>
            </div>
        );

    if (error)
        return (
            <div className="max-w-md mx-auto mt-10 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-md text-center">
                <p className="font-semibold">Error Loading Products</p>
                <p className="text-sm">{error}</p>
            </div>
        );

    return (
        <div className="p-6 mt-8">
            <h2 className="text-2xl font-bold text-center mb-6">Our Brands</h2>

            {/* {loading && <p className="text-center">Loading...</p>}
            {error && <p className="text-center text-red-500">{error}</p>} */}

            {!loading && !error && brands.length === 0 && (
                <div className="flex flex-col items-center justify-center mt-12">
                    <NoResults />
                    <p className="text-gray-500 text-lg mt-4 text-center">
                        Oops! No brand found.
                    </p>
                </div>
            )}

            {!loading && !error && brands.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {brands.map((brand) => (
                        <Link to={`/brand/${brand.name}`} key={brand._id}>
                            <div
                                className="flex flex-col items-center bg-white p-4 shadow-lg rounded-xl transition-transform transform hover:scale-105"
                            >
                                <img
                                    src={brand.logo}
                                    alt={brand.name}
                                    className="w-20 h-20 object-contain mb-3 rounded-lg"
                                />
                                <p className="text-lg font-semibold">{brand.name}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BrandList;
