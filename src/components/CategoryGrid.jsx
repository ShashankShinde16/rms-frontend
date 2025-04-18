import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_URL = `http://13.200.204.1/api/v1/categories/`;

const CategoryGrid = () => {
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const CategoriesPerPage = 5;
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
        <div className="w-12 h-12 border-4 border-blue-400 border-dashed rounded-full animate-spin"></div>
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
    <div className="px-4 py-6 sm:px-6 lg:px-12 bg-gray-50 rounded-lg shadow-md transition-all duration-300">
      <h2 className="text-center text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
        Explore Categories
      </h2>

      <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
        {currentPage > 0 && (
          <button
            onClick={handlePrev}
            className="mb-2 sm:mb-0 sm:mr-4 p-3 rounded-full bg-white text-black border border-gray-300 shadow-sm hover:bg-gray-100 hover:shadow-md active:scale-95 transition duration-200 ease-in-out flex items-center justify-center"
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
        )}


        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 w-full">
          {visibleCategories.map((category) => (
            <Link
              to={`/category/${category.name}`}
              key={category._id}
              state={{
                categoryId: category._id,
                categoryName: category.name,
                categoryImage: category.Image,
              }}
              className="group bg-white shadow-lg rounded-xl overflow-hidden transform transition-transform hover:scale-[1.03] hover:shadow-xl"
            >
              <img
                src={category.Image}
                alt={category.name}
                className="w-full h-44 md:h-56 lg:h-64 object-cover"
              />
              <div className="p-3 text-center font-semibold text-gray-700 group-hover:text-blue-600 transition">
                {category.name}
              </div>
            </Link>
          ))}
        </div>

        {currentPage < totalPages - 1 && (
          <button
            onClick={handleNext}
            className="mt-2 sm:mt-0 sm:ml-4 p-3 rounded-full bg-white text-black border border-gray-300 shadow-sm hover:bg-gray-100 hover:shadow-md active:scale-95 transition duration-200 ease-in-out flex items-center justify-center"
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
        )}


      </div>
    </div>
  );
};

export default CategoryGrid;
