import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import Pagination from "./Pagination";
import Cookies from "js-cookie";
import FiltersSidebar from "./FiltersSidebar";
import { colorGroups } from "../util/colorGroups";
import NoResults from "../util/NoFound";

const API_Brand_URL = `${import.meta.env.VITE_API_BASE_URL}/products/brand/`;
const API_Category_URL = `${import.meta.env.VITE_API_BASE_URL}/products/category/`;
const API_CATEGORIES_URL = `${import.meta.env.VITE_API_BASE_URL}/categories`;
const API_SUBCATEGORIES_URL = `${import.meta.env.VITE_API_BASE_URL}/subcategories/`;
const API_FABRICS_URL = `${import.meta.env.VITE_API_BASE_URL}/products/fabrics`;

const ProductListBy = () => {
  const location = useLocation();
  const { categoryId, categoryName, categoryImage, brandImage } = location.state || {};  // Access categoryId
  const { brandName } = useParams();
  const [products, setProducts] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedDiscounts, setSelectedDiscounts] = useState([]);
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSleeves, setSelectedSleeves] = useState([]);
  const [fabrics, setFabrics] = useState([]);
  const [selectedFabrics, setSelectedFabrics] = useState([]);
  const [subCategories, setSubCategories] = useState();
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
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

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const response = await axios.get(API_SUBCATEGORIES_URL);
        setSubCategories(response.data.getAllSubCategories);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    const fetchFabrics = async () => {
      try {
        const response = await axios.get(API_FABRICS_URL);
        setFabrics(response.data.fabrics || []);
      } catch (error) {
        console.error("Error fetching fabrics:", error);
      }
    };
    const fetchCategories = async () => {
      try {
        const response = await axios.get(API_CATEGORIES_URL);
        setCategories(response.data.getAllCategories || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
    fetchFabrics();
    fetchSubCategories();
  }, []);

  // Handle change in variation selection
  const handleVariationChange = (productId, variation) => {
    setSelectedVariations((prev) => ({
      ...prev,
      [productId]: variation,
    }));
  };


  const handleCategoryFilterChange = (id, isChecked) => {
    setSelectedCategories(prev =>
      isChecked ? [...prev, id] : prev.filter(c => c !== id)
    );
  };

  const handleSubCategoryFilterChange = (id, isChecked) => {
    setSelectedSubCategories(prev =>
      isChecked ? [...prev, id] : prev.filter(sc => sc !== id)
    );
  };

  const handleColorFilterChange = (parentColor, isChecked) => {
    setSelectedColors(prev =>
      isChecked ? [...prev, parentColor] : prev.filter(c => c !== parentColor)
    );
  };

  const handleSizeFilterChange = (id, isChecked) => {
    setSelectedSizes(prev =>
      isChecked ? [...prev, id] : prev.filter(s => s !== id)
    );
  };

  const handleSleeveFilterChange = (id, isChecked) => {
    setSelectedSleeves(prev =>
      isChecked ? [...prev, id] : prev.filter(s => s !== id)
    );
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

  // Pagination logic
  const applyFilters = () => {
    let filtered = [...products];

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

    if (selectedColors.length > 0) {
      filtered = filtered.filter(product =>
        product.variations.some(variation =>
          selectedColors.some(selectedParentColor =>
            colorGroups[selectedParentColor]?.includes(variation.color)
          )
        )
      );
    }

    if (selectedSleeves.length > 0) {
      filtered = filtered.filter(product =>
        selectedSleeves.includes(product.sleeve)
      );
    }


    if (selectedFabrics.length > 0) {
      filtered = filtered.filter(product =>
        selectedFabrics.includes(product.fabric)
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
      <div className="px-4 py-6 mt-12">
        {/* Category Poster */}
        <div className="w-full flex justify-center mb-4">
          <img
            src={categoryImage || brandImage}
            alt={categoryName || brandName}
            className="w-full object-contain rounded-lg shadow-lg mb-4 
     h-auto sm:h-auto md:h-[400px] lg:h-[500px]"
          />

        </div>

        {/* Heading */}
        <h2 className="text-center text-2xl font-bold text-[#466351] mb-6">
          {categoryId ? categoryName : `Products for ${brandName}`}
        </h2>

        {/* Filter Toggle Button (Mobile only) */}
        <div className="md:hidden flex justify-start mb-4">
          <button
            className="bg-gray-800 text-white px-4 py-2 rounded"
            onClick={() => setIsSidebarOpen(true)}
          >
            Filters
          </button>
        </div>

        {/* Main Content */}
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
              onFabricChange={(id, isChecked) =>
                setSelectedFabrics(prev =>
                  isChecked ? [...prev, id] : prev.filter(f => f !== id)
                )
              }
            />

          </div>

          {/* Product Grid */}
          <div className="w-full">
            {currentProducts.length === 0 ? (
              <>
                <NoResults />
                <p className="text-center text-[#466351]">No products available.</p>
              </>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {currentProducts.map((product) => {
                  const selected = selectedVariations[product._id] || product.variations[0];
                  return (
                    <Link
                      key={product._id}
                      to={`/product/${product._id}`}
                      state={{ product }}
                      className="transform transition-transform hover:scale-[1.03]"
                    >
                      <div className="rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-green-50 to-green-100 border border-green-200 hover:shadow-xl transition-all duration-300">

                        {/* Product Image */}
                        <div
                          className="w-full h-[250px] bg-center bg-cover"
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
                          <div className="mt-2 flex gap-2">
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

      {/* Sidebar Overlay for Mobile */}
      <div
        className={`fixed inset-0 z-50 transition-transform duration-300 ease-in-out md:hidden ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-transparent bg-opacity-50"
          onClick={() => setIsSidebarOpen(false)}
        ></div>

        {/* Drawer */}
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
            onFabricChange={(id, isChecked) =>
              setSelectedFabrics(prev =>
                isChecked ? [...prev, id] : prev.filter(f => f !== id)
              )
            }
          />
        </div>
      </div>
    </>
  );


};

export default ProductListBy;
