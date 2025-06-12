import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserAlt, FaShoppingCart, FaBars, FaHeart, FaSearch } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import Cookies from "js-cookie";
import ProfilePopup from "./profile/ProfilePopup";
import { debounce } from "lodash";
import { toast } from "react-hot-toast";
import axios from "axios";
import "./Navbar.css";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}`;

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const mobileSearchRef = useRef(null);

  const user_token = Cookies.get("user_token");
  const navigate = useNavigate();
  const profileRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const cartRef = useRef(null);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${user_token}` },
      });
      setUser(response.data.user);
    } catch (err) {
      console.error("Error fetching user", err);
    }
  };

  useEffect(() => {
    if (user_token) fetchUser();
  }, []);

  useEffect(() => {
    const handleClickOutsideSearch = (event) => {
      if (
        showMobileSearch &&
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(event.target)
      ) {
        setShowMobileSearch(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutsideSearch);
    return () => document.removeEventListener("mousedown", handleClickOutsideSearch);
  }, [showMobileSearch]);

  const fetchSuggestions = debounce(async (query) => {
    if (!query) return setSuggestions([]);
    try {
      const response = await axios.get(`${API_URL}/products/search/suggestions?q=${query}`);
      setSuggestions(response.data.suggestions);
    } catch (error) {
      console.error("Error fetching suggestions", error);
    }
  }, 300);

  useEffect(() => {
    fetchSuggestions(searchQuery);
  }, [searchQuery]);

  const { cart, removeFromCart, updateQuantity } = useCart();
  const cartItemCount = cart?.cartItem?.length || 0;

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const toggleCart = () => setCartOpen(!cartOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) setMobileMenuOpen(false);
      if (cartRef.current && !cartRef.current.contains(event.target)) setCartOpen(false);
      if (profileRef.current && !profileRef.current.contains(event.target)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRemove = (id) => {
    toast(
      (t) => (
        <div className="text-gray-800">
          <p className="mb-2">Are you sure you want to remove this item?</p>
          <div className="flex justify-end space-x-3">
            <button
              className="px-3 py-1 bg-red-600 text-white rounded-md"
              onClick={() => {
                removeFromCart(id);
                toast.dismiss(t.id);
                toast.success("Item removed successfully!");
              }}
            >
              Yes, Remove
            </button>
            <button className="px-3 py-1 bg-gray-300 rounded-md" onClick={() => toast.dismiss(t.id)}>
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: 5000 }
    );
  };

  return (
    <nav className="flex items-center justify-between px-5 py-1 bg-[#f7f3f3] fixed top-0 left-0 w-full h-12 z-50 shadow-md">
      {/* Logo and Hamburger */}
      <div className="flex items-center text-xl font-bold">
        <FaBars className="text-2xl mr-3 cursor-pointer block text-[#003e25]" onClick={toggleMobileMenu} />
        <Link to="/">
          <img src="/images/web-Logo.png" alt="Logo" className="h-6 w-auto max-w-full" />
        </Link>
      </div>

      {/* Desktop Search */}
      <div className="hidden sm:flex items-center relative w-1/3">
        <input
          type="text"
          className="font-sans text-sm bg-gray-100 text-gray-600 px-4 py-2 rounded-full w-full transition-all focus:outline-none focus:bg-gray-200 focus:shadow-md"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          className="absolute right-3 top-1/2 transform -translate-y-1/2"
          onClick={() => {
            if (searchQuery.trim()) navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
          }}
        >
          <FaSearch className="text-gray-500" />
        </button>

        {suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-xl z-50">
            <ul className="divide-y divide-gray-200">
              {suggestions.map((item, index) => (
                <li
                  key={index}
                  onClick={() => {
                    setSearchQuery(item.name);
                    navigate(`/search?q=${encodeURIComponent(item.name)}`);
                  }}
                  className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-sm text-gray-800 flex items-center"
                >
                  <FaSearch className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="truncate">{item.name}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <FaSearch
          className="block sm:hidden text-xl cursor-pointer text-[#003e25]"
          onClick={() => setShowMobileSearch(true)}
        />

        <div className="relative" ref={profileRef}>
          <FaUserAlt
            className="cursor-pointer text-[#003e25]"
            onClick={() => (user_token ? setProfileOpen(!profileOpen) : navigate("/login"))}
          />
          {profileOpen && (
            <div className="absolute right-0 mt-2 bg-[#466351] border border-[#466351] rounded shadow-md z-50">
              <Link
                onClick={() => {
                  setShowProfilePopup(true);
                  setProfileOpen(false);
                }}
                className="block px-4 py-2 text-center text-white hover:bg-[#3a5245] transition-colors duration-200"
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  Cookies.remove("user_details");
                  Cookies.remove("user_token");
                  navigate("/login");
                }}
                className="block px-4 py-2 w-full text-white text-center hover:bg-[#3a5245] whitespace-nowrap transition-colors duration-200"
              >
                Sign Out
              </button>
            </div>

          )}
        </div>

        <Link to="/wishlist">
          <FaHeart className="cursor-pointer text-[#003e25]" />
        </Link>

        <div className="relative">
          <FaShoppingCart className="cursor-pointer text-[#003e25]" onClick={toggleCart} />
          {cartItemCount > 0 && <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">{cartItemCount}</span>}
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {showMobileSearch && (
        <div ref={mobileSearchRef} className="absolute top-0 left-0 w-full bg-[#f7f3f3] px-4 z-50 shadow-md">
          <div className="flex items-center h-12">
            <input
              type="text"
              autoFocus
              className="font-sans text-sm bg-gray-100 text-gray-600 px-4 py-2 rounded-full w-full transition-all focus:outline-none focus:bg-gray-200 focus:shadow-md"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              className="ml-2 text-[#003e25]"
              onClick={() => {
                if (searchQuery.trim()) navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                setShowMobileSearch(false);
              }}
            >
              <FaSearch />
            </button>
            <button
              className="ml-2 text-gray-500"
              onClick={() => setShowMobileSearch(false)}
            >
              ✕
            </button>
          </div>

          {suggestions.length > 0 && (
            <div className="mt-2 mb-2.5 bg-white border border-gray-300 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
              <ul className="divide-y divide-gray-200">
                {suggestions.map((item, index) => (
                  <li
                    key={index}
                    onClick={() => {
                      setSearchQuery(item.name);
                      navigate(`/search?q=${encodeURIComponent(item.name)}`);
                      setShowMobileSearch(false);
                    }}
                    className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-sm text-gray-800 flex items-center"
                  >
                    <FaSearch className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="truncate">{item.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}



      {/* Mobile Menu */}
      < div
        ref={mobileMenuRef}
        className={`mobile-menu ${mobileMenuOpen ? "open" : ""}`}
      >
        <Link to="/">Home</Link>
        <Link to="/shop">Shop</Link>
        <Link to="/coupon">Coupon</Link>
        <Link to="/order">Order</Link>
        <Link to="/about">About</Link>
      </div >

      {/* Cart Drawer */}
      <div ref={cartRef} className={`cart-slider ${cartOpen ? "open" : ""}`}>
        <h2>My Cart</h2>
        {cartItemCount === 0 ? (
          <p>No items in the cart yet!</p>
        ) : (
          <div className="cart-items">
            {cart.cartItem.map((item) => {
              const matchingVariation = item.productId.variations.find((variation) =>
                variation.sizes.some((size) => size._id === item.variationId)
              );
              const selectedSize = matchingVariation?.sizes.find((size) => size._id === item.variationId) || null;

              return (
                <div key={item._id} className="cart-item">
                  <img src={matchingVariation?.images?.[0] || item.image} alt={item.productId.name} className="cart-item-image" />
                  <div className="cart-item-details">
                    <h3>{item.productId.name}</h3>
                    <p>Size: {selectedSize?.size || "N/A"}</p>
                    <p>Price: ₹{selectedSize?.price || item.price}</p>
                    <select
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.productId._id, parseInt(e.target.value))}
                      className="p-2 border rounded-md w-16 text-sm"
                    >
                      {[...Array(selectedSize?.stock).keys()].map((num) => (
                        <option key={num + 1} value={num + 1}>
                          {num + 1}
                        </option>
                      ))}
                    </select>
                    <button className="remove-from-cart-btn" onClick={() => handleRemove(item._id)}>Remove</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <button className="hover:bg-green-700 bg-[#466351] text-white px-4 py-2 rounded-md mt-5" onClick={() => navigate("/cart")}>
          View Cart
        </button>
      </div>

      {showProfilePopup && <ProfilePopup me={user} onClose={() => setShowProfilePopup(false)} fetchUser={fetchUser} />}
    </nav >
  );
};

export default Navbar;
