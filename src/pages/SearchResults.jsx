import { useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FiltersSidebar from "../components/FiltersSidebar";
import Pagination from "../components/Pagination";
import NoResults from "../util/NoFound";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}`;

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
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSleeves, setSelectedSleeves] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [fabrics, setFabrics] = useState([]);
  const [selectedFabrics, setSelectedFabrics] = useState([]);
  const [sizes, setSizes] = useState([]); // Example sizes for filtering
  const [selectedSizes, setSelectedSizes] = useState([]);


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

  useEffect(() => {
    axios.get(`${API_URL}/subcategories`)
      .then((response) => setSubCategories(response.data.getAllSubCategories))
      .catch((err) => console.error("Error fetching subcategories:", err));

    axios.get(`${API_URL}/products/fabrics`)
      .then((response) => setFabrics(response.data.fabrics))
      .catch((err) => console.error("Error fetching fabrics:", err));

    axios.get(`${API_URL}/categories`)
      .then((response) => setCategories(response.data.getAllCategories))
      .catch((err) => console.error("Error fetching categories:", err));

  }, []);


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

  const handleSubCategoryFilterChange = (id, isChecked) => {
    setSelectedSubCategories(prev =>
      isChecked ? [...prev, id] : prev.filter(sc => sc !== id)
    );
  };

  const handleFabricFilterChange = (id, isChecked) => {
    setSelectedFabrics(prev =>
      isChecked ? [...prev, id] : prev.filter(f => f !== id)
    );
  };

  const handleSizeFilterChange = (id, isChecked) => {
    setSelectedSizes(prev =>
      isChecked ? [...prev, id] : prev.filter(s => s !== id)
    );
  };

  const handleCategoryFilterChange = (id, isChecked) => {
    setSelectedCategories(prev =>
      isChecked ? [...prev, id] : prev.filter(c => c !== id)
    );
  };

  const handleColorFilterChange = (parentColor, isChecked) => {
    setSelectedColors(prev =>
      isChecked ? [...prev, parentColor] : prev.filter(c => c !== parentColor)
    );
  };

  const handleSleeveFilterChange = (id, isChecked) => {
    setSelectedSleeves(prev =>
      isChecked ? [...prev, id] : prev.filter(s => s !== id)
    );
  };

  const applyFilters = () => {
    let filtered = [...results];

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product =>
        selectedCategories.includes(product.category_id._id)
      );
    }

    if (selectedSubCategories.length > 0) {
      filtered = filtered.filter(product =>
        selectedSubCategories.includes(product.subcategory_id._id)
      );
    }

    if (selectedSizes.length > 0) {
      filtered = filtered.filter(product =>
        product.variations.some(variation =>
          variation.sizes.some(size =>
            selectedSizes.includes(size.size)
          )
        )
      );
    }

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

    if (selectedFabrics.length > 0) {
      filtered = filtered.filter(product =>
        selectedFabrics.includes(product.fabric)
      );
    }

    if (selectedColors.length > 0) {
      filtered = filtered.filter(product =>
        product.variations.some(variation =>
          selectedColors.includes(variation.color)
        )
      );
    }

    if (selectedSleeves.length > 0) {
      filtered = filtered.filter(product =>
        selectedSleeves.includes(product.sleeve)
      );
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
        <div className="md:hidden flex justify-start mb-4">
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
              onSubCategoryChange={handleSubCategoryFilterChange}
              subCategories={subCategories}
              onSizeChange={handleSizeFilterChange}
              onColorChange={handleColorFilterChange}
              categories={categories}
              onCategoryChange={handleCategoryFilterChange}
              fabrics={fabrics}
              onSleeveChange={handleSleeveFilterChange}
              onFabricChange={handleFabricFilterChange}
            />


          </div>

          {/* Product Grid */}
          <div className="w-full">
            {currentProducts.length === 0 ? (
              <>
                <NoResults />
                <p className="text-center text-[#466351]">No products found.</p>
              </>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {currentProducts.map((product) => (
                  <Link
                    to={`/product/${product._id}`}
                    key={product._id}
                    state={{ product }}
                    className="transform transition-transform hover:scale-[1.03]"
                  >
                    <div className="rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-green-50 to-green-100 border border-green-200 hover:shadow-xl transition-all duration-300">

                      {/* Product Image */}
                      <div
                        className="w-full h-64 bg-center bg-cover"
                        style={{ backgroundImage: `url(${selectedImages[product._id]})` }}
                      ></div>

                      {/* Product Info */}
                      <div className="p-4">
                        <h3 className="font-semibold text-lg text-[#466351] mb-1">{product.name}</h3>
                        <p className="text-sm text-gray-700 mb-2">
                          <span className="line-through mr-2 text-gray-400">₹{product.basePrice}</span>
                          <span className="text-green-700 font-bold">₹{product.variations[0].sizes[0].price}</span>
                          <span className="ml-2 bg-red-500 text-white px-2 py-0.5 text-xs rounded">
                            -{product.variations[0].sizes[0].discount}%
                          </span>
                        </p>

                        {/* Variations */}
                        <div className="flex mt-2">
                          {product.variations.map((variation, index) => {
                            const isSelected = selectedImages[product._id] === variation.images[0];
                            return (
                              <img
                                key={index}
                                src={variation.images[0]}
                                alt={`${product.name} - Variation ${index + 1}`}
                                className="w-8 h-8 rounded-full mr-2 border-2 cursor-pointer"
                                style={{
                                  borderColor: isSelected ? "#003e25" : "transparent",
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
            onSubCategoryChange={handleSubCategoryFilterChange}
            subCategories={subCategories}
            onSizeChange={handleSizeFilterChange}
            onColorChange={handleColorFilterChange}
            categories={categories}
            onCategoryChange={handleCategoryFilterChange}
            fabrics={fabrics}
            onSleeveChange={handleSleeveFilterChange}
            onFabricChange={handleFabricFilterChange}
          />

        </div>
      </div>

      <Footer />
    </>
  );
};

export default SearchResults;
