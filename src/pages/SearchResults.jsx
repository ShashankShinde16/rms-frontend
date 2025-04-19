import { useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FiltersSidebar from "../components/FiltersSidebar";
import Pagination from "../components/Pagination";
import NoResults from "../util/NoFound";

const API_URL = "https://rmsjeans.com/api/v1";

const SearchResults = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search).get("q");
  const [results, setResults] = useState([]);
  const [selectedImages, setSelectedImages] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Filters
  const [selectedDiscounts, setSelectedDiscounts] = useState([]);
  const [selectedPrices, setSelectedPrices] = useState([]);

  const productsPerPage = 8;

  useEffect(() => {
    if (query) {
      axios
        .get(`${API_URL}/products/search?q=${query}`)
        .then((res) => {
          const data = res.data.products;
          setResults(data);

          const defaultImages = {};
          data.forEach((product) => {
            if (product.variations.length > 0 && product.variations[0].images.length > 0) {
              defaultImages[product._id] = product.variations[0].images[0];
            }
          });
          setSelectedImages(defaultImages);
        })
        .catch((err) => console.error("Search error", err));
    }
  }, [query]);

  const handleVariationChange = (productId, newImage) => {
    setSelectedImages((prevImages) => ({
      ...prevImages,
      [productId]: newImage,
    }));
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

  const applyFilters = () => {
    let filtered = [...results];

    if (selectedDiscounts.length > 0) {
      filtered = filtered.filter(product => {
        const discount = product.variations[0].sizes[0].discount;
        return selectedDiscounts.some(id => {
          if (id === "discount-5-10") return discount >= 5 && discount < 15;
          if (id === "discount-15-20") return discount >= 15 && discount < 25;
          if (id === "discount-25") return discount >= 25;
          return false;
        });
      });
    }

    if (selectedPrices.length > 0) {
      filtered = filtered.filter(product => {
        const price = product.variations[0].sizes[0].price;
        return selectedPrices.some(id => {
          if (id === "price-under-500") return price < 500;
          if (id === "price-500-1000") return price >= 500 && price <= 1000;
          if (id === "price-above-1000") return price > 1000;
          return false;
        });
      });
    }

    return filtered;
  };

  const filteredProducts = applyFilters();
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      <Navbar />

      <div className="px-4 py-6 mt-12">
        {/* Heading */}
        <h2 className="text-center text-2xl font-bold mb-6">
          Search Results for "{query}"
        </h2>

        {/* Filter Toggle (Mobile) */}
        <div className="md:hidden flex justify-end mb-4">
          <button
            className="bg-gray-800 text-white px-4 py-2 rounded"
            onClick={() => setIsSidebarOpen(true)}
          >
            Filters
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          {/* Sidebar (Desktop) */}
          <div className="md:w-1/4 hidden md:block">
            <FiltersSidebar
              onDiscountChange={handleDiscountFilterChange}
              onPriceChange={handlePriceFilterChange}
            />
          </div>

          {/* Product Grid */}
          <div className="w-full">
            {currentProducts.length === 0 ? (
              <>
                <NoResults />
                <p className="text-center text-gray-500">No products found.</p>
              </>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {currentProducts.map((product) => (
                  <Link
                    to={`/product/${product._id}`}
                    key={product._id}
                    state={{ product }}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition transform hover:scale-[1.02]"
                  >
                    <img
                      className="w-full h-[250px] object-cover object-center"
                      src={selectedImages[product._id]}
                      alt={product.name}
                    />

                    <div className="p-4">
                      <h3 className="font-semibold text-lg">{product.name}</h3>

                      <p className="text-gray-700 mt-1">
                        <span className="line-through mr-2 text-sm">₹{product.basePrice}</span>
                        <span className="font-bold text-green-600 text-md">
                          ₹{product.variations[0].sizes[0].price}
                        </span>
                        <span className="ml-2 bg-red-500 text-white px-2 py-0.5 text-xs rounded">
                          -{product.variations[0].sizes[0].discount}%
                        </span>
                      </p>

                      <div className="mt-2 flex gap-2">
                        {product.variations.map((variation, index) => {
                          const isSelected = selectedImages[product._id] === variation.images[0];
                          return (
                            <img
                              key={index}
                              src={variation.images[0]}
                              alt={`${product.name} - Variation ${index + 1}`}
                              className={`w-8 h-8 rounded-full cursor-pointer border-2 ${isSelected ? "border-black" : "border-transparent"
                                }`}
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
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      <div
        className={`fixed inset-0 z-50 transition-transform duration-300 ease-in-out md:hidden ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={() => setIsSidebarOpen(false)}
        ></div>

        <div className="absolute left-0 top-0 h-full w-3/4 max-w-sm bg-white p-4 shadow-lg z-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Filters</h3>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="text-xl font-bold"
            >
              &times;
            </button>
          </div>
          <FiltersSidebar
            onDiscountChange={handleDiscountFilterChange}
            onPriceChange={handlePriceFilterChange}
          />
        </div>
      </div>

      <Footer />
    </>
  );
};

export default SearchResults;
