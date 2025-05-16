import React, { useState } from 'react';
import { colorGroups } from "../util/colorGroups";

const FiltersSidebar = ({
  onDiscountChange,
  onSubCategoryChange,
  subCategories = [],
  onSizeChange,
  categories = [],
  onCategoryChange,
  fabrics = [],
  onFabricChange,
  onColorChange,
  onSleeveChange,
}) => {
  const [activeFilter, setActiveFilter] = useState(null);
  const parentColors = Object.keys(colorGroups);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedFabrics, setSelectedFabrics] = useState([]);
  const [selectedOffers, setSelectedOffers] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSleeves, setSelectedSleeves] = useState([]);

  const toggleFilter = (filterName) => {
    setActiveFilter((prev) => (prev === filterName ? null : filterName));
  };

  const handleCheckboxChange = (e, setType, selectedState, setSelectedState) => {
    const value = e.target.id;
    const isChecked = e.target.checked;

    setType(value, isChecked);

    if (isChecked) {
      setSelectedState([...selectedState, value]);
    } else {
      setSelectedState(selectedState.filter((v) => v !== value));
    }
  };

  const handleRemoveSelected = (value, type) => {
    if (type === 'category') {
      setSelectedCategories(selectedCategories.filter((v) => v !== value));
      onCategoryChange(value, false);
    }
    if (type === 'subcategory') {
      setSelectedSubCategories(selectedSubCategories.filter((v) => v !== value));
      onSubCategoryChange(value, false);
    }
    if (type === 'size') {
      setSelectedSizes(selectedSizes.filter((v) => v !== value));
      onSizeChange(value, false);
    }
    if (type === 'color') {
      const colorName = parentColors.find(color => colorGroups[color].includes(value)) || '';
      setSelectedColors(selectedColors.filter((v) => v !== value));
      onColorChange(colorName, false);
    }
    if (type === 'fabric') {
      const fabricName = fabrics.find(f => f._id === value)?.name || '';
      setSelectedFabrics(selectedFabrics.filter((v) => v !== value));
      onFabricChange(fabricName, false);
    }
    if (type === 'offer') {
      setSelectedOffers(selectedOffers.filter((v) => v !== value));
      onDiscountChange(value, false);
    }
    if (type === 'sleeve') {
      setSelectedSleeves(selectedSleeves.filter((v) => v !== value));
      onSleeveChange(value, false);
    }
  };

  const sizes = ["M-38", "L-40", "XL-42", "2XL-44", "3XL-46"];
  const sleeveOptions = ["Full Sleeve", "Half Sleeve"];
  const filterTabs = ["Category", "Size", "Colours", "Pattern", "Sleeve", "Fabric", "Offer"];

  return (
    <div className=" bg-white p-4 space-y-6 rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-green-50 to-green-100 border border-green-200 hover:shadow-xl transition-all duration-300">
      {/* Horizontal Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
        {filterTabs.map((filterName) => (
          <button
            key={filterName}
            onClick={() => toggleFilter(filterName)}
            className={`px-4 py-2 rounded-full text-sm md:text-base transition-all duration-200
              ${activeFilter === filterName
                ? 'bg-green-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-green-50 hover:text-green-700'}`}
          >
            {filterName}
          </button>
        ))}
      </div>

      {/* Filter Options */}
      {activeFilter && (
        <div>
          <h3 className="text-xl font-semibold text-green-900 mb-4">{activeFilter}</h3>

          {activeFilter === "Category" && (
            <ul className="space-y-3">
              {categories.map((cat) => (
                <li key={cat._id} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id={cat._id}
                    className="accent-green-600 w-4 h-4 transition-transform transform hover:scale-105"
                    checked={selectedCategories.includes(cat._id)}
                    onChange={(e) => handleCheckboxChange(e, onCategoryChange, selectedCategories, setSelectedCategories)}
                  />
                  <label htmlFor={cat._id} className="cursor-pointer text-gray-800">{cat.name}</label>
                </li>
              ))}
            </ul>
          )}

          {activeFilter === "Pattern" && (
            <ul className="space-y-3">
              {subCategories.map((sub) => (
                <li key={sub._id} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id={sub._id}
                    className="accent-green-600 w-4 h-4 transition-transform transform hover:scale-105"
                    checked={selectedSubCategories.includes(sub._id)}
                    onChange={(e) => handleCheckboxChange(e, onSubCategoryChange, selectedSubCategories, setSelectedSubCategories)}
                  />
                  <label htmlFor={sub._id} className="cursor-pointer text-gray-800">{sub.name}</label>
                </li>
              ))}
            </ul>
          )}

          {activeFilter === "Size" && (
            <ul className="grid grid-cols-2 gap-4">
              {sizes.map((size) => (
                <li key={size} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id={size}
                    className="accent-green-600 w-4 h-4 transition-transform transform hover:scale-105"
                    checked={selectedSizes.includes(size)}
                    onChange={(e) => handleCheckboxChange(e, onSizeChange, selectedSizes, setSelectedSizes)}
                  />
                  <label htmlFor={size} className="cursor-pointer text-gray-800">{size}</label>
                </li>
              ))}
            </ul>
          )}


          {activeFilter === "Colours" && (
            <ul className="grid grid-cols-2 gap-4">
              {parentColors.map((color) => (
                <li key={color} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id={color}
                    className="accent-green-600 w-4 h-4"
                    checked={selectedColors.map(c => c.toLowerCase()).includes(color.toLowerCase())}
                    onChange={(e) =>
                      handleCheckboxChange(
                        e,
                        onColorChange,
                        selectedColors,
                        setSelectedColors
                      )
                    }
                  />
                  <label htmlFor={color} className="cursor-pointer text-gray-800">
                    {color}
                  </label>
                </li>
              ))}
            </ul>
          )}



          {activeFilter === "Fabric" && (
            <ul className="space-y-3">
              {fabrics.map(fabric => (
                <li key={fabric._id} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id={fabric._id}
                    className="accent-green-600 w-4 h-4 transition-transform transform hover:scale-105"
                    checked={selectedFabrics.includes(fabric._id)}
                    onChange={(e) => handleCheckboxChange(e, (value, checked) => onFabricChange(fabric.name, checked), selectedFabrics, setSelectedFabrics)}
                  />
                  <label htmlFor={fabric._id} className="cursor-pointer text-gray-800">{fabric.name}</label>
                </li>
              ))}
            </ul>
          )}

          {activeFilter === "Offer" && (
            <ul className="space-y-3">
              {["discount-5-10", "discount-15-20", "discount-25"].map((id, i) => (
                <li key={id} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id={id}
                    className="accent-green-600 w-4 h-4 transition-transform transform hover:scale-105"
                    checked={selectedOffers.includes(id)}
                    onChange={(e) => handleCheckboxChange(e, onDiscountChange, selectedOffers, setSelectedOffers)}
                  />
                  <label htmlFor={id} className="cursor-pointer text-gray-800">
                    {i === 0 ? "5% - 10% Off" : i === 1 ? "15% - 20% Off" : "25% & Above"}
                  </label>
                </li>
              ))}
            </ul>
          )}


          {activeFilter === "Sleeve" && (
            <ul className="space-y-3">
              {sleeveOptions.map((sleeve) => (
                <li key={sleeve} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id={sleeve}
                    className="accent-green-600 w-4 h-4 transition-transform transform hover:scale-105"
                    checked={selectedSleeves.includes(sleeve)}
                    onChange={(e) =>
                      handleCheckboxChange(e, onSleeveChange, selectedSleeves, setSelectedSleeves)
                    }
                  />
                  <label htmlFor={sleeve} className="cursor-pointer text-gray-800">{sleeve}</label>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Selected Filters Summary */}
      {(selectedCategories.length > 0 || selectedSubCategories.length > 0 || selectedSizes.length > 0 || selectedFabrics.length > 0 || selectedOffers.length > 0 || selectedColors.length > 0 || selectedSleeves.length > 0) && (
        <div className="border-t border-gray-200 pt-4 space-y-2">
          <h4 className="text-md font-semibold text-green-800">Selected Filters:</h4>
          <div className="flex flex-wrap gap-2">
            {selectedSubCategories.map((id) => {
              const name = subCategories.find(sub => sub._id === id)?.name || id;
              return (
                <span key={id} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center space-x-2 shadow-sm">
                  <span>{name}</span>
                  <button onClick={() => handleRemoveSelected(id, 'subcategory')} className="text-red-500 hover:text-red-700">×</button>
                </span>
              );
            })}
            {selectedCategories.map((id) => {
              const name = categories.find(cat => cat._id === id)?.name || id;
              return (
                <span key={id} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center space-x-2 shadow-sm">
                  <span>{name}</span>
                  <button onClick={() => handleRemoveSelected(id, 'category')} className="text-red-500 hover:text-red-700">×</button>
                </span>
              );
            })}

            {selectedSizes.map((size) => (
              <span key={size} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center space-x-2 shadow-sm">
                <span>{size}</span>
                <button onClick={() => handleRemoveSelected(size, 'size')} className="text-red-500 hover:text-red-700">×</button>
              </span>
            ))}
            {selectedColors.map((color) => (
              <span key={color} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center space-x-2 shadow-sm">
                <span>{color}</span>
                <button onClick={() => handleRemoveSelected(color, 'color')} className="text-red-500 hover:text-red-700">×</button>
              </span>
            ))}
            {selectedSleeves.map((sleeve) => (
              <span key={sleeve} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center space-x-2 shadow-sm">
                <span>{sleeve}</span>
                <button onClick={() => handleRemoveSelected(sleeve, 'sleeve')} className="text-red-500 hover:text-red-700">×</button>
              </span>
            ))}
            {selectedFabrics.map((id) => {
              const name = fabrics.find(f => f._id === id)?.name || id;
              return (
                <span key={id} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center space-x-2 shadow-sm">
                  <span>{name}</span>
                  <button onClick={() => handleRemoveSelected(id, 'fabric')} className="text-red-500 hover:text-red-700">×</button>
                </span>
              );
            })}
            {selectedOffers.map((id) => (
              <span key={id} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center space-x-2 shadow-sm">
                <span>{id.replace('discount-', '').replace('-', ' - ') + '% Off'}</span>
                <button onClick={() => handleRemoveSelected(id, 'offer')} className="text-red-500 hover:text-red-700">×</button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FiltersSidebar;
