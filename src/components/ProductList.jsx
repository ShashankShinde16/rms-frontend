import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import Pagination from "./Pagination";
import Cookies from "js-cookie";
import FiltersSidebar from "./FiltersSidebar";

const API_Brand_URL = `http://13.200.204.1/api/v1/products/brand/`;
const API_Category_URL = `http://13.200.204.1/api/v1/products/category/`;

const ProductList = ({ categoryId }) => {
    // Sample Product List

    // const location = useLocation();
    // const {categoryId , categoryName} = location.state;  // Access categoryId
    const { brandName } = useParams();
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 8;
    const user_token = Cookies.get("user_token");
    const [selectedImages, setSelectedImages] = useState({}); // Track selected images

    useEffect(() => {
        const fetchProducts = async () => {
            const URL = categoryId ? `${API_Category_URL}${categoryId}` : `${API_Brand_URL}${brandName}`;
            try {
                const response = await axios.get(`${URL}`, {
                    headers: { Authorization: `Bearer ${user_token}` }
                });

                const productsData = response.data.products;
                setProducts(productsData);

                // Set default images for each product based on the first variation
                const defaultImages = {};
                productsData.forEach((product) => {
                    if (product.variations.length > 0 && product.variations[0].images.length > 0) {
                        defaultImages[product._id] = product.variations[0].images[0];
                    }
                });
                setSelectedImages(defaultImages);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, [brandName]);

    // Handle image change on variation selection
    const handleVariationChange = (productId, newImage) => {
        setSelectedImages((prevImages) => ({
            ...prevImages,
            [productId]: newImage,
        }));
    };

    // Pagination logic
    const totalPages = Math.ceil(products.length / productsPerPage);
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const currentProducts = products.slice(startIndex, endIndex);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="p-5">
            {/* {categoryId ?
              <h2 className="text-center text-2xl font-bold my-2">{categoryName}</h2>
              :
              <h2 className="text-center text-2xl font-bold my-2">Products for {brandName}</h2>
          } */}
            <h2 className="text-center text-2xl font-bold my-2">Related Product</h2>
            <div className="flex justify-center mb-4 gap-2">
                {currentProducts.length === 0 ? (
                    <p className="text-center text-gray-500">No products available.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {currentProducts.map((product) => (
                            <Link
                                to={`/product/${product._id}`}
                                key={product._id}
                                state={{ product }}
                                className="rounded-lg shadow-md overflow-hidden hover:shadow-lg transition transform hover:scale-105"
                            >
                                <div className="product-card">
                                    {/* Main Product Image */}
                                    <img
                                        className={`w-full object-cover object-center`}
                                        src={selectedImages[product._id]}
                                        alt={product.name}
                                        style={{
                                            height: "300px"
                                        }}
                                    />

                                    <div className="p-4">
                                        <h3 className="font-semibold">{product.name}</h3>

                                        {/* Pricing Section */}
                                        <p className="text-gray-700">
                                            <span className="line-through mr-2">₹{product.basePrice}</span>
                                            <span className="font-bold text-green-600">₹{product.variations[0].sizes[0].price}</span>
                                            <span className="ml-2 bg-red-500 text-white px-2 py-1 text-xs rounded">
                                                -{product.variations[0].sizes[0].discount}%
                                            </span>
                                        </p>

                                        {/* Variation Thumbnails */}
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

            {/* Pagination Component */}
            {totalPages > 1 && (
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            )}
        </div>
    );
};

export default ProductList;
