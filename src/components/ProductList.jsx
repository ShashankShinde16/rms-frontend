import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import Pagination from "./Pagination";
import Cookies from "js-cookie";

const API_Brand_URL = `https://rmsjeans.com/api/v1/products/brand/`;
const API_Category_URL = `https://rmsjeans.com/api/v1/products/category/`;

const ProductList = ({ categoryId }) => {
    // Sample Product List

    // const location = useLocation();
    // const {categoryId , categoryName} = location.state;  // Access categoryId
    const { brandName } = useParams();
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 8;
    const user_token = Cookies.get("user_token");
    const [selectedVariations, setSelectedVariations] = useState({});

    useEffect(() => {
        const fetchProducts = async () => {
            const URL = categoryId ? `${API_Category_URL}${categoryId}` : `${API_Brand_URL}${brandName}`;
            try {
                const response = await axios.get(`${URL}`, {
                    headers: { Authorization: `Bearer ${user_token}` }
                });

                const productsData = response.data.products;
                setProducts(productsData);

                const defaultVariations = {};
productsData.forEach((product) => {
  if (product.variations.length > 0) {
    defaultVariations[product._id] = product.variations[0];
  }
});
setSelectedVariations(defaultVariations);

            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, [brandName]);

const handleVariationChange = (productId, variation) => {
  setSelectedVariations((prev) => ({
    ...prev,
    [productId]: variation,
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
            <h2 className="text-center text-2xl text-green-900 font-bold my-2">Related Product</h2>
            <div className="flex justify-center mb-4 gap-2">
                {currentProducts.length === 0 ? (
                    <p className="text-center text-green-900">No products available.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {currentProducts.map((product) => {
                            const selected = selectedVariations[product._id] || product.variations[0];
                            return(
                                <Link
                                key={product._id}
                                to={`/product/${product._id}`}
                                state={{ product }}
                                className="transform transition-transform hover:scale-[1.03]"
                            >
                                <div className="rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-green-50 to-green-100 border border-green-200 hover:shadow-xl transition-all duration-300">
                                    {/* Main Product Image */}
                                    <img
                                        className="w-full object-cover object-center"
                                        src={selected.images[0]}
                                        alt={product.name}
                                        style={{
                                            height: "300px"
                                        }}
                                    />

                                    <div className="p-4">
                                        <h3 className="font-semibold text-green-900">{product.name}</h3>

                                        {/* Pricing Section */}
                                        <p className="text-gray-700">
                                            <span className="line-through mr-2 text-sm">₹{product.basePrice}</span>
                                            <span className="font-bold text-green-600 text-md">
                                                ₹{selected.sizes[0].price}
                                            </span>
                                            <span className="ml-2 bg-red-500 text-white px-2 py-1 text-xs rounded">
                                                -{selected.sizes[0].discount}%
                                            </span>
                                        </p>

                                        {/* Variation Thumbnails */}
                                        <div className="variations-container mt-2 flex gap-2">
                                            {product.variations.map((variation, index) => {
                                               const isSelected = selected === variation;
                                                return (
                                                    <img
                                                        key={index}
                                                        src={variation.images[0]}
                                                        alt={`${product.name} - Variation ${index + 1}`}
                                                        className="w-8 h-8 rounded-full cursor-pointer border-2"
                                                        style={{
                                                            borderColor: isSelected ? "#003e25" : "transparent",
                                                        }}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            handleVariationChange(product._id, variation);
                                                        }}
                                                    />
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                            )
})}
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
