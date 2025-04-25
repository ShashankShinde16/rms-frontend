import React from 'react';

const FiltersSidebar = ({ onDiscountChange, onPriceChange, onSubCategoryChange, subCategories = [], onSizeChange }) => {
  const handleCheckboxChange = (e, setType) => {
    const value = e.target.id;
    const isChecked = e.target.checked;
    setType(value, isChecked);
  };

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  return (
    <div className="w-full p-4 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Filters</h2>

      {/* SubCategory Filter */}
      {subCategories.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2 text-gray-800">Subcategories</h3>
          <ul className="space-y-2">
            {subCategories.map((sub) => (
              <li key={sub._id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={sub._id}
                  className="accent-blue-600 rounded"
                  onChange={(e) => handleCheckboxChange(e, onSubCategoryChange)}
                />
                <label htmlFor={sub._id} className="cursor-pointer text-gray-700 hover:text-blue-600 transition">
                  {sub.name}
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Size Filter */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2 text-gray-800">Size</h3>
        <ul className="grid grid-cols-3 gap-3">
          {sizes.map((size) => (
            <li key={size} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={size}
                className="accent-blue-600 rounded"
                onChange={(e) => handleCheckboxChange(e, onSizeChange)}
              />
              <label htmlFor={size} className="cursor-pointer text-gray-700 hover:text-blue-600 transition">
                {size}
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Price Filter */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2 text-gray-800">Price</h3>
        <ul className="space-y-2">
          {["price-under-500", "price-500-1000", "price-above-1000"].map((id, i) => (
            <li key={id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={id}
                className="accent-blue-600 rounded"
                onChange={(e) => handleCheckboxChange(e, onPriceChange)}
              />
              <label htmlFor={id} className="cursor-pointer text-gray-700 hover:text-blue-600 transition">
                {i === 0 ? "Under ₹500" : i === 1 ? "₹500 - ₹1000" : "Above ₹1000"}
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Discount Filter */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2 text-gray-800">Offer</h3>
        <ul className="space-y-2">
          {["discount-5-10", "discount-15-20", "discount-25"].map((id, i) => (
            <li key={id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={id}
                className="accent-blue-600 rounded"
                onChange={(e) => handleCheckboxChange(e, onDiscountChange)}
              />
              <label htmlFor={id} className="cursor-pointer text-gray-700 hover:text-blue-600 transition">
                {i === 0 ? "5% - 10% Off" : i === 1 ? "15% - 20% Off" : "25% & Above"}
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FiltersSidebar;
