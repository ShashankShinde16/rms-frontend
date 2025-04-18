import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useLocation } from "react-router-dom";
import FiltersSidebar from "../components/FiltersSidebar";
import NoResults from "../util/NoFound";

const demoProducts = [
    {
        _id: "1",
        name: "Nike Air Max",
        basePrice: 7999,
        variations: [
            {
                images: ["/images/nike-air-max-1.jpg"],
                sizes: [{ price: 6999, discount: 12 }],
            },
        ],
    },
    {
        _id: "2",
        name: "Adidas Ultraboost",
        basePrice: 9999,
        variations: [
            {
                images: ["/images/adidas-ultraboost-1.jpg"],
                sizes: [{ price: 8499, discount: 15 }],
            },
        ],
    },
    {
        _id: "3",
        name: "Puma RS-X",
        basePrice: 7499,
        variations: [
            {
                images: ["/images/puma-rs-x-1.jpg"],
                sizes: [{ price: 6499, discount: 13 }],
            },
        ],
    },
    {
        _id: "4",
        name: "Reebok Classic",
        basePrice: 6599,
        variations: [
            {
                images: ["/images/reebok-classic-1.jpg"],
                sizes: [{ price: 5599, discount: 15 }],
            },
        ],
    },
];

const API_NEW_ARRIVALS_URL = `http://13.200.204.1/api/v1/products/`;
const API_NEW_ARRIVALS_Category_URL = `http://13.200.204.1/api/v1/products/category/`;

const posterMap = {
    "Full sleeve": "https://d118ps6mg0w7om.cloudfront.net/media/boolfly/banner/SS-25-Full-Sleeves-Shirts.jpg",
    "Formal": "https://d118ps6mg0w7om.cloudfront.net/media/boolfly/banner/SS-25-Half-Sleeves-Shirts.jpg",
    "Tshirt": "https://d118ps6mg0w7om.cloudfront.net/media/boolfly/banner/SS-25-Tees.jpg",
    // Add more categories as needed
};


const NewArrivals = () => {
    const location = useLocation();
    const { categoryId, categoryName } = location.state || {}; // Access categoryId and categoryName from state
    const [products, setProducts] = useState([]);
    const [poster, setPoster] = useState(true);
    const [selectedDiscounts, setSelectedDiscounts] = useState([]);
    const [selectedPrices, setSelectedPrices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 8;
    const [selectedImages, setSelectedImages] = useState({});
    const user_token = Cookies.get("user_token");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const fetchNewArrivals = async () => {
            const URL = categoryId ? `${API_NEW_ARRIVALS_Category_URL}${categoryId}` : `${API_NEW_ARRIVALS_URL}`;
            try {
                const response = await axios.get(`${URL}`);

                const productsData = categoryId ? response.data.products : response.data.getAllProducts;

                // Filter products updated in the last 30 days
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

                const recentProducts = productsData.filter(product => {
                    const updatedAtDate = new Date(product.updatedAt);
                    return updatedAtDate >= thirtyDaysAgo;
                });

                setProducts(recentProducts);

                // Set default images
                const defaultImages = {};
                recentProducts.forEach((product) => {
                    if (product.variations.length > 0 && product.variations[0].images.length > 0) {
                        defaultImages[product._id] = product.variations[0].images[0];
                    }
                });
                setSelectedImages(defaultImages);
            } catch (error) {
                console.error("Error fetching new arrivals:", error);
            }
        };

        fetchNewArrivals();
    }, []);

    useEffect(() => {
        if (categoryName && posterMap[categoryName]) {
            setPoster(posterMap[categoryName]);
        } else {
            setPoster("https://d118ps6mg0w7om.cloudfront.net/media/images/New-Arrivals.jpg"); // Optional: fallback poster or leave empty
        }
    }, [categoryName]);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedDiscounts, selectedPrices]);

    const handleVariationChange = (productId, newImage) => {
        setSelectedImages((prevImages) => ({
            ...prevImages,
            [productId]: newImage,
        }));
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleDiscountFilterChange = (id, isChecked) => {
        setSelectedDiscounts(prev =>
            isChecked ? [...prev, id] : prev.filter(d => d !== id)
        );
    };

    const handlePriceFilterChange = (id, isChecked) => {
        setSelectedPrices(prev =>
            isChecked ? [...prev, id] : prev.filter(p => p !== id)
        );
    };

    const getFilteredProducts = () => {
        return products.filter(product => {
            const discount = product.variations[0].sizes[0].discount;
            const price = product.variations[0].sizes[0].price;

            let matchesDiscount = selectedDiscounts.length === 0 || selectedDiscounts.some(range => {
                if (range === "discount-5-10") return discount >= 5 && discount <= 10;
                if (range === "discount-15-20") return discount >= 15 && discount <= 20;
                if (range === "discount-25") return discount >= 25;
                return false;
            });

            let matchesPrice = selectedPrices.length === 0 || selectedPrices.some(range => {
                if (range === "price-under-500") return price < 500;
                if (range === "price-500-1000") return price >= 500 && price <= 1000;
                if (range === "price-above-1000") return price > 1000;
                return false;
            });

            return matchesDiscount && matchesPrice;
        });
    };

    const filteredProducts = getFilteredProducts();
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const currentProducts = filteredProducts.slice(startIndex, endIndex);

    return (
        <>
            <div className="flex flex-col min-h-screen">
                <Navbar />

                {/* Main Content */}
                <div className="flex-1 p-4 mt-12">
                    <div className="w-full flex justify-center mb-4">
                        <img
                            src={poster}
                            alt={categoryName}
                            className="h-[500px] object-contain rounded-lg shadow-lg mb-4"
                        />
                    </div>

                    <h2 className="text-center text-2xl font-bold my-4">New Arrivals</h2>

                    {/* Filter Toggle (Mobile) */}
                    <div className="md:hidden flex justify-end mb-4">
                        <button
                            className="bg-gray-800 text-white px-4 py-2 rounded"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            Filters
                        </button>
                    </div>

                    {/* Layout */}
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Sidebar (desktop only) */}
                        <div className="hidden md:block md:w-1/4">
                            <FiltersSidebar
                                onDiscountChange={handleDiscountFilterChange}
                                onPriceChange={handlePriceFilterChange}
                            />
                        </div>

                        {/* Product Grid */}
                        <div className="w-full">
                            {filteredProducts.length === 0 ? (
                                <>
                                    <NoResults />
                                    <p className="text-center text-gray-500">No new arrivals available.</p>
                                </>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {filteredProducts.map((product) => (
                                        <Link
                                            to={`/product/${product._id}`}
                                            key={product._id}
                                            state={{ product }}
                                            className="rounded-lg shadow-md overflow-hidden hover:shadow-lg transition transform hover:scale-105"
                                        >
                                            <div className="product-card">
                                                <img
                                                    className="w-full object-cover object-center"
                                                    src={selectedImages[product._id]}
                                                    alt={product.name}
                                                    style={{ height: "300px" }}
                                                />
                                                <div className="p-4">
                                                    <h3 className="font-semibold">{product.name}</h3>
                                                    <p className="text-gray-700">
                                                        <span className="line-through mr-2">₹{product.basePrice}</span>
                                                        <span className="font-bold text-green-600">₹{product.variations[0].sizes[0].price}</span>
                                                        <span className="ml-2 bg-red-500 text-white px-2 py-1 text-xs rounded">
                                                            -{product.variations[0].sizes[0].discount}%
                                                        </span>
                                                    </p>
                                                    <div className="variations-container mt-2 flex">
                                                        {product.variations.map((variation, index) => {
                                                            const isSelected = selectedImages[product._id] === variation.images[0];
                                                            return (
                                                                <img
                                                                    key={index}
                                                                    src={variation.images[0]}
                                                                    alt={`${product.name} - Variation ${index + 1}`}
                                                                    className="variation-thumbnail"
                                                                    style={{
                                                                        width: "30px",
                                                                        height: "30px",
                                                                        marginRight: "5px",
                                                                        borderRadius: "50%",
                                                                        border: isSelected ? "2px solid black" : "none",
                                                                        cursor: "pointer",
                                                                    }}
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        e.stopPropagation();
                                                                        handleVariationChange(product._id, variation.images[0]);
                                                                    }}
                                                                />
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    )}
                </div>

                {/* Footer pushed to bottom if needed */}
                <Footer />
            </div>

            {/* Sidebar Overlay */}
            <div
                className={`fixed inset-0 z-50 transition-transform duration-300 ease-in-out md:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                {/* Overlay */}
                <div
                    className="absolute inset-0 bg-opacity-50"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>

                {/* Drawer */}
                <div className="absolute left-0 top-0 h-full w-auto max-w-sm bg-white p-4 shadow-lg z-50">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold">Filters</h3>
                        <button onClick={() => setIsSidebarOpen(false)} className="text-xl font-bold">&times;</button>
                    </div>
                    <FiltersSidebar
                        onDiscountChange={handleDiscountFilterChange}
                        onPriceChange={handlePriceFilterChange}
                    />
                </div>
            </div>
        </>

    );
};

export default NewArrivals;
