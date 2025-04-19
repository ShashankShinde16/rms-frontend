import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import NoResults from "../util/NoFound";

const API_PRODUCTS_URL = `https://rmsjeans.com/api/v1/products/`;
const API_CATEGORIES_URL = `https://rmsjeans.com/api/v1/categories/`;
const API_SUBCATEGORIES_URL = `https://rmsjeans.com/api/v1/subcategories/`;

const ProductGrid = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(["All"]); // Default category
  const [subcategories, setSubcategories] = useState(["All"]);
  const [selectedSubcategory, setSelectedSubcategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(0);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const productsPerPage = 4;
  const [selectedImages, setSelectedImages] = useState({});

  // Handle image change on variation selection
  const handleVariationChange = (productId, newImage) => {
    setSelectedImages((prevImages) => ({
      ...prevImages,
      [productId]: newImage,
    }));
  };

  const handleSubcategoryChange = (event) => {
    setSelectedSubcategory(event.target.value);
    setCurrentPage(0);
  };


  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(API_PRODUCTS_URL);
        const productsData = response.data.getAllProducts;
        setProducts(productsData);

        const defaultImages = {};
        productsData.forEach((product) => {
          if (product.variations.length > 0 && product.variations[0].images.length > 0) {
            defaultImages[product._id] = product.variations[0].images[0];
          }
        });
        setSelectedImages(defaultImages);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get(API_CATEGORIES_URL);
        setCategories([...response.data.getAllCategories]);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    const fetchSubCategories = async () => {
      try {
        const response = await axios.get(API_SUBCATEGORIES_URL);
        setSubcategories([...response.data.getAllSubCategories]);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchProducts();
    fetchCategories();
    fetchSubCategories();
  }, []);

  // Filter products based on category
  const filteredProducts = products.filter((product) => {
    const categoryMatch = filter === "All" || product.category_id.name === filter;
    const subcategoryMatch = selectedSubcategory === "All" || product.subcategory_id?.name === selectedSubcategory;
    return categoryMatch && subcategoryMatch;
  });

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Handle Pagination
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 0));

  // Reset to first page when filter changes
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setCurrentPage(0);
  };

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
    <div className="p-5">
      {/* Filter Dropdown */}
      <div className="flex flex-col sm:flex-row justify-end gap-4 mb-6">
        <div>
          <label htmlFor="filter" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            id="filter"
            value={filter}
            onChange={handleFilterChange}
            className="w-full sm:w-48 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="All">All</option>
            {categories.map((category) => (
              <option key={category.name} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="subcategory-filter" className="block text-sm font-medium text-gray-700 mb-1">Subcategory</label>
          <select
            id="subcategory-filter"
            value={selectedSubcategory}
            onChange={handleSubcategoryChange}
            className="w-full sm:w-48 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="All">All</option>
            {subcategories.map((subcat, i) => (
              <option key={i} value={subcat.name}>
                {subcat.name}
              </option>
            ))}
          </select>
        </div>
      </div>


      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh]">
          <NoResults />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts
            .slice(currentPage * productsPerPage, (currentPage + 1) * productsPerPage)
            .map((product) => (
              <Link
                key={product._id}
                to={`/product/${product._id}`}
                className="rounded-lg shadow-md overflow-hidden hover:shadow-lg transition transform hover:scale-105"
                state={{ product }}
              >
                <div className="product-card bg-white rounded-lg">
                  {/* Main Product Image */}
                  <div className="w-full h-64 bg-cover bg-center"
                    style={{ backgroundImage: `url(${selectedImages[product._id]})` }}>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-lg">{product.name}</h3>

                    {/* Pricing Section */}
                    <p className="text-gray-700">
                      <span className="line-through mr-2 text-gray-500">₹{product.basePrice}</span>
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
                            className="w-8 h-8 rounded-full mr-2 cursor-pointer"
                            style={{
                              border: isSelected ? "2px solid black" : "none",
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

      {/* Pagination Controls */}
      {filteredProducts.length > productsPerPage && (
        <div className="flex justify-center mt-6 space-x-4">
          <button
            onClick={handlePrev}
            disabled={currentPage === 0}
            className={`p-3 rounded-full bg-white text-black border border-gray-300 shadow-sm transition duration-200 ease-in-out flex items-center justify-center 
        ${currentPage === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100 hover:shadow-md active:scale-95"}`}
            title="Previous Page"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages - 1}
            className={`p-3 rounded-full bg-white text-black border border-gray-300 shadow-sm transition duration-200 ease-in-out flex items-center justify-center 
        ${currentPage === totalPages - 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100 hover:shadow-md active:scale-95"}`}
            title="Next Page"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

    </div>
  );
};

export default ProductGrid;
