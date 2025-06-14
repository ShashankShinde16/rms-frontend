import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import FiltersSidebar from "../components/FiltersSidebar";
import NoResults from "../util/NoFound";

const API_ALL_PRODUCTS = `${import.meta.env.VITE_API_BASE_URL}/products/`;

const FlatOff = () => {
    const [products, setProducts] = useState([]);
    const [selectedVariations, setSelectedVariations] = useState({});
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedSubCategories, setSelectedSubCategories] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [selectedSleeves, setSelectedSleeves] = useState([]);
    const [selectedFabrics, setSelectedFabrics] = useState([]);
    const [selectedPrices, setSelectedPrices] = useState([]);
    const [selectedDiscounts, setSelectedDiscounts] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [categories, setCategories] = useState([]);
    const [fabrics, setFabrics] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
                    return discount === offerValue;
                });

                setProducts(flat20Products);

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

        const fetchFilters = async () => {
            try {
                const subCatRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/subcategories/`);
                setSubCategories(subCatRes.data.getAllSubCategories);

                const catRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/categories`);
                setCategories(catRes.data.getAllCategories);

                const fabricsRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/products/fabrics`);
                setFabrics(fabricsRes.data.fabrics || []);
            } catch (error) {
                console.error('Error fetching filters data', error);
            }
        };

        fetchFilters();
        fetchProducts();
    }, []);

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

    const handleFabricFilterChange = (id, isChecked) => {
        setSelectedFabrics(prev =>
            isChecked ? [...prev, id] : prev.filter(f => f !== id)
        );
    };

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
                const discount = product.variations[0]?.sizes[0]?.discount;
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
                const price = product.variations[0]?.sizes[0]?.price;
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
                    selectedColors.includes(variation.color)
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


    return (
        <>
            <div className="flex flex-col min-h-screen">
                <Navbar />

                {/* Main Content */}
                <div className="flex-1 p-4 mt-12">
                    <div className="w-full flex justify-center mb-4">
                        <img
                            src={image}
                            alt={`Flat ${offerValue}% Off`}
                            className="w-full object-contain rounded-lg shadow-lg mb-4 
         h-auto sm:h-auto md:h-[400px] lg:h-[500px]"/>
                    </div>

                    <h2 className="text-center text-2xl text-[#466351] font-bold my-4">Flat {offerValue}% Off</h2>

                    {/* Filter Toggle (Mobile) */}
                    <div className="md:hidden flex justify-start mb-4">
                        <button
                            className="bg-gray-800 text-white px-4 py-2 rounded"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            Filters
                        </button>
                    </div>

                    {/* Layout */}
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Sidebar (desktop only) */}
                        <div className="hidden md:block md:w-1/4">
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
                                    <p className="text-center text-[#466351]">No products with {offerValue}% off.</p>
                                </>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                                                                        className="w-8 h-8 rounded-full mr-2 border-2 cursor-pointer"
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

                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    )}
                </div>

                <Footer />
            </div>

            {/* Sidebar Overlay (Mobile Filters) */}
            <div
                className={`fixed inset-0 z-50 transition-transform duration-300 ease-in-out md:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                {/* Overlay */}
                <div
                    className="absolute inset-0 bg-opacity-50"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>

                {/* Drawer */}
                <div className="absolute left-0 top-0 h-full w-3/4 max-w-sm bg-white p-4 shadow-lg z-50">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold">Filters</h3>
                        <button onClick={() => setIsSidebarOpen(false)} className="text-xl font-bold">&times;</button>
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
        </>

    );
};

export default FlatOff;
