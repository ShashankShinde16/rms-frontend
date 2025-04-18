import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import NoResults from "../util/NoFound";

const API_ALL_PRODUCTS = `http://13.200.204.1/api/v1/products/`;

const FlatOff = () => {
    const [products, setProducts] = useState([]);
    const [selectedImages, setSelectedImages] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 8;
    const location = useLocation();
    const { offer, image } = location.state || {};
    const offerValue = Number(String(offer).trim());

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(API_ALL_PRODUCTS);
                const allProducts = response.data.getAllProducts || [];
                const flat20Products = allProducts.filter(product => {
                    const discount = product.variations?.[0]?.sizes?.[0]?.discount;
                    console.log(discount, offerValue);
                    return discount === offerValue;
                });

                setProducts(flat20Products);

                const defaultImages = {};
                flat20Products.forEach((product) => {
                    if (product.variations?.[0]?.images?.[0]) {
                        defaultImages[product._id] = product.variations[0].images[0];
                    }
                });
                setSelectedImages(defaultImages);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, []);

    const handleVariationChange = (productId, newImage) => {
        setSelectedImages((prevImages) => ({
            ...prevImages,
            [productId]: newImage,
        }));
    };

    const totalPages = Math.ceil(products.length / productsPerPage);
    const startIndex = (currentPage - 1) * productsPerPage;
    const currentProducts = products.slice(startIndex, startIndex + productsPerPage);

    return (
        <>
            <div className="flex flex-col min-h-screen">
                <Navbar />

                <div className="flex-1 p-4 mt-12">
                    <div className="w-full flex justify-center mb-4">
                        <img
                            src={image}
                            alt={`Flat ${offerValue}% Off`}
                            className="h-[500px] object-contain rounded-lg shadow-lg mb-4"
                        />
                    </div>

                    <h2 className="text-center text-2xl font-bold my-4">Flat {offerValue}% Off</h2>

                    {/* Layout */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="w-full">
                            {products.length === 0 ? (
                                <>
                                    <NoResults />
                                    <p className="text-center text-gray-500">No products with {offerValue}% off.</p>
                                </>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {currentProducts.map((product) => (
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
                </div>

                <Footer />
            </div>
        </>
    );
};

export default FlatOff;
