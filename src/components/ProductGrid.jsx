import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import NoResults from "../util/NoFound";

const API_PRODUCTS_URL = `${import.meta.env.VITE_API_BASE_URL}/products/`;
const API_CATEGORIES_URL = `${import.meta.env.VITE_API_BASE_URL}/categories/`;
const API_SUBCATEGORIES_URL = `${import.meta.env.VITE_API_BASE_URL}/subcategories/`;

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
  const [selectedVariations, setSelectedVariations] = useState({});


  // Handle image change on variation selection
  const handleVariationChange = (productId, variation) => {
    setSelectedVariations((prev) => ({
      ...prev,
      [productId]: variation,
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

        const defaultVariations = {};
        productsData.forEach((product) => {
          if (product.variations.length > 0) {
            defaultVariations[product._id] = product.variations[0];
          }
        });
        setSelectedVariations(defaultVariations);
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
        <div className="w-12 h-12 border-4 border-green-700 border-dashed rounded-full animate-spin"></div>
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
      {/* Filter Dropdowns */}
      <div className="flex flex-col sm:flex-row justify-end gap-4 mb-6">
        {/* Category Dropdown */}
        <div className="relative w-full sm:w-60">
          <label htmlFor="filter" className="block text-sm font-semibold text-[#466351] mb-1">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-green-700" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              Category
            </span>
          </label>
          <select
            id="filter"
            value={filter}
            onChange={handleFilterChange}
            className="block w-full p-2.5 bg-white border border-green-300 text-[#466351] text-sm rounded-xl shadow-sm focus:ring-green-600 focus:border-green-600 transition duration-200 ease-in-out"
          >
            <option value="All">All</option>
            {categories.map((category) => (
              <option key={category.name} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>


        {/* Subcategory Dropdown */}
        <div className="relative w-full sm:w-60">
          <label htmlFor="subcategory-filter" className="block text-sm font-semibold text-[#466351] mb-1">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-green-700" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
              </svg>
              Pattern
            </span>
          </label>
          <select
            id="subcategory-filter"
            value={selectedSubcategory}
            onChange={handleSubcategoryChange}
            className="block w-full p-2.5 bg-white border border-green-300 text-[#466351] text-sm rounded-xl shadow-sm focus:ring-green-600 focus:border-green-600 transition duration-200 ease-in-out"
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
          <p className="text-center text-[#466351]">No products available.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts
            .slice(currentPage * productsPerPage, (currentPage + 1) * productsPerPage)
            .map((product) => {
              const selected = selectedVariations[product._id] || product.variations[0];
              return (
                <Link
                  key={product._id}
                  to={`/product/${product._id}`}
                  className="transform transition-transform hover:scale-[1.03]"
                  state={{ product }}
                >
                  <div className="rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-green-50 to-green-100 border border-green-200 hover:shadow-xl transition-all duration-300">
                    {/* Product Image */}
                    <div
                      className="w-full h-64 bg-center bg-cover"
                      style={{ backgroundImage: `url(${selected.images[0]})` }}
                    ></div>

                    {/* Product Info */}
                    <div className="p-4">
                      <h3 className="font-semibold text-lg text-[#466351] mb-1">{product.name}</h3>
                      <p className="text-sm text-gray-700 mb-2">
                        <span className="line-through mr-2 text-gray-400">₹{product.basePrice}</span>
                        <span className="text-green-700 font-bold">₹{selected.sizes[0].price}</span>
                        <span className="ml-2 bg-red-500 text-white px-2 py-0.5 text-xs rounded">
                          -{selected.sizes[0].discount}%
                        </span>
                      </p>

                      {/* Variations */}
                      <div className="flex mt-2">
                        {product.variations.map((variation, index) => {
                          const isSelected = selected === variation;
                          return (
                            <img
                              key={index}
                              src={variation.images[0]}
                              alt=""
                              className="w-8 h-8 rounded-full mr-2 border-2"
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

      {/* Pagination */}
      {filteredProducts.length > productsPerPage && (
        <div className="flex justify-center mt-6 gap-4">
          <button
            onClick={handlePrev}
            disabled={currentPage === 0}
            className={`p-3 rounded-full bg-white text-[#466351] border border-green-400 shadow-sm transition duration-200 ease-in-out flex items-center justify-center ${currentPage === 0
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-green-50 hover:shadow-md active:scale-95"
              }`}
            title="Previous Page"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages - 1}
            className={`p-3 rounded-full bg-white text-[#466351] border border-green-400 shadow-sm transition duration-200 ease-in-out flex items-center justify-center ${currentPage === totalPages - 1
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-green-50 hover:shadow-md active:scale-95"
              }`}
            title="Next Page"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;