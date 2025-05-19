import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/categories/`;

const CategoryGrid = () => {
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const CategoriesPerPage = 4;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(API_URL);
        setCategories(response.data.getAllCategories);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const totalPages = Math.ceil(categories.length / CategoriesPerPage);
  const startIndex = currentPage * CategoriesPerPage;
  const visibleCategories = categories.slice(startIndex, startIndex + CategoriesPerPage);

  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 0));

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <div className="w-12 h-12 border-4 border-green-700 border-dashed rounded-full animate-spin"></div>
      </div>
    );

  if (error)
    return (
      <div className="max-w-md mx-auto mt-10 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-md text-center">
        <p className="font-semibold">Error Loading Categories</p>
        <p className="text-sm">{error}</p>
      </div>
    );

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-12 bg-white rounded-lg shadow-md transition-all duration-300">
      <h2 className="text-center text-3xl font-bold text-green-800 mb-6">
        Explore Categories
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6 w-full mb-6">
        {visibleCategories.map((category) => (
          <Link
            to={`/category/${category.name}`}
            key={category._id}
            state={{
              categoryId: category._id,
              categoryName: category.name,
              categoryImage: category.Image,
            }}
            className="group bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl overflow-hidden transform transition-transform hover:scale-[1.03] hover:shadow-lg"
          >
            <img
              src={category.Image}
              alt={category.name}
              className="w-full h-44 md:h-56 lg:h-96 object-cover"
            />
            <div className="p-3 text-center font-semibold text-green-900 group-hover:text-green-700 transition">
              {category.name}
            </div>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-4">
          <button
            onClick={handlePrev}
            disabled={currentPage === 0}
            className={`p-3 rounded-full bg-white text-green-800 border border-green-400 shadow-sm transition duration-200 ease-in-out flex items-center justify-center ${
              currentPage === 0
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-green-50 hover:shadow-md active:scale-95"
            }`}
            title="Previous Page"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <span className="text-sm text-green-800 font-medium">
            Page {currentPage + 1} of {totalPages}
          </span>

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages - 1}
            className={`p-3 rounded-full bg-white text-green-800 border border-green-400 shadow-sm transition duration-200 ease-in-out flex items-center justify-center ${
              currentPage === totalPages - 1
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-green-50 hover:shadow-md active:scale-95"
            }`}
            title="Next Page"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoryGrid;
