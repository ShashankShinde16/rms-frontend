import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaUserAlt, FaShoppingCart, FaBars, FaHeart } from "react-icons/fa";
import { useCart } from "../context/CartContext"; // Access cart context
import Cookies from "js-cookie";
import ProfilePopup from "./profile/ProfilePopup"; // Import ProfilePopup component
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import { debounce } from "lodash";
import { toast } from "react-hot-toast";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}`;

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const user_token = Cookies.get("user_token");
  const navigate = useNavigate();
  const profileRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const cartRef = useRef(null);
  const [showProfilePopup, setShowProfilePopup] = useState(false);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${API_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${user_token}`,
        },
      });
      setUser(response.data.user);
    } catch (err) {
      console.error("Error fetching user", err);
    }
  };

  useEffect(() => {
    if (user_token) fetchUser();
  }, []);

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

  const { cart, removeFromCart, updateQuantity } = useCart(); // Access cart state and actions
  let cartItemCount = cart?.cartItem?.length || 0;

  // Toggle mobile menu visibility
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  // Toggle cart drawer visibility
  const toggleCart = () => setCartOpen(!cartOpen);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setMobileMenuOpen(false);
      }
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setCartOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
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
            <button
              className="px-3 py-1 bg-gray-300 rounded-md"
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: 5000 }
    );
  };

  return (
    <nav className="navbar">
      {/* Logo and Hamburger Menu */}
      <div className="navbar-logo ">
        <FaBars className="hamburger-icon" onClick={toggleMobileMenu} />
        <Link to="/">
          <img
            src="/images/Logo.png" // Replace with your logo
            alt="Logo"
            className="navbar-logo-img"
          />
        </Link>
      </div>

      {/* Profile, Search, and Cart */}
      <div className="navbar-right">
        <div className="navbar-search">
          <div className="search">
            <input
              type="text"
              className="search__input"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <button className="search__button"
              onClick={() => {
                if (searchQuery.trim()) {
                  navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                }
              }}>
              <svg
                className="search__icon"
                aria-hidden="true"
                viewBox="0 0 24 24"
              >
                <g>
                  <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
                </g>
              </svg>
            </button>

            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 w-full max-h-60 overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-xl z-50 transition-all duration-300">
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
                      <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
                      </svg>
                      <span className="truncate">{item.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>
        </div>
        <div className="navbar-actions">
          <div className="relative" ref={profileRef}>
            <FaUserAlt className="cursor-pointer size-5 text-[#003e25] stroke-[1.5px]" onClick={() => user_token ? setProfileOpen(!profileOpen) : navigate("/login")} />
            {profileOpen && (
              <div className="profile-dropdown">
                <Link onClick={() => { setShowProfilePopup(true); setProfileOpen(false) }} className="dropdown-item w-100 text-center">Profile</Link>
                <button onClick={() => {
                  Cookies.remove("user_details");
                  Cookies.remove("user_token");
                  navigate("/login"); // Redirect to login page
                }} className="dropdown-item w-100">Sign Out</button>
              </div>
            )}
          </div>

          <div className="flex items-center relative">
            <Link to="/wishlist" className="icon cursor-pointer">
              <FaHeart
                className="cursor-pointer size-5 text-[#003e25] stroke-[1.5px]"
              />
            </Link>
          </div>

          <div className="flex items-center relative">
            <FaShoppingCart
              className="cursor-pointer size-5 text-[#003e25] stroke-[1.5px]"
              onClick={toggleCart} // Toggle cart visibility
            />
            {cartItemCount > 0 && (
              <span className="cart-item-count">{cartItemCount}</span> // Show item count in cart
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sliding Menu */}
      <div
        ref={mobileMenuRef}
        className={`mobile-menu ${mobileMenuOpen ? "open" : ""}`}
      >
        <Link to="/">Home</Link>
        <Link to="/shop">Shop</Link>
        <Link to="/coupon">Coupon</Link>
        <Link to="/order">Order</Link>
        <Link to="/about">About</Link>
      </div>

      {/* Mobile Sliding Menu */}
      {/* <div
        ref={mobileMenuRef}
        className={`fixed top-0 left-0 h-full w-3/4 sm:w-1/2 md:w-1/3 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      > */}
      {/* <div className="flex flex-col items-center p-6"> */}
      {/* Logo */}
      {/* <img
            src="/images/Login-Logo.png"
            alt="Logo"
            className="w-20 h-20 mb-6"
          /> */}

      {/* Navigation Links */}
      {/* <nav className="w-full flex flex-col gap-4 text-center">
            <Link
              to="/"
              className="py-2 px-4 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-800 hover:text-white transition-colors"
            >
              Home
            </Link>
            <Link
              to="/shop"
              className="py-2 px-4 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-800 hover:text-white transition-colors"
            >
              Shop
            </Link>
            <Link
              to="/coupon"
              className="py-2 px-4 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-800 hover:text-white transition-colors"
            >
              Coupon
            </Link>
            <Link
              to="/order"
              className="py-2 px-4 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-800 hover:text-white transition-colors"
            >
              Order
            </Link>
            <Link
              to="/about"
              className="py-2 px-4 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-800 hover:text-white transition-colors"
            >
              About
            </Link>
          </nav> */}
      {/* </div> */}
      {/* </div> */}


      {/* Cart Slider */}
      <div ref={cartRef} className={`cart-slider ${cartOpen ? "open" : ""}`}>
        <h2>My Cart</h2>
        {cartItemCount === 0 ? (
          <p>No items in the cart yet!</p>
        ) : (
          <div className="cart-items">
            {cart.cartItem.map((item) => {
              // Find the variation that contains the selected variationId
              const matchingVariation = item.productId.variations.find(
                (variation) =>
                  variation.sizes.some((size) => size._id === item.variationId)
              );

              // Find the correct size details
              const selectedSize = matchingVariation
                ? matchingVariation.sizes.find(
                  (size) => size._id === item.variationId
                )
                : null;

              return (
                <div key={item._id} className="cart-item">
                  <img
                    src={matchingVariation?.images?.[0] || item.image}
                    alt={item.productId.name}
                    className="cart-item-image"
                  />
                  <div className="cart-item-details">
                    <h3>{item.productId.name}</h3>
                    <p>Size: {selectedSize?.size || "N/A"}</p>
                    <p>Price: ₹{selectedSize?.price || item.price}</p>
                    <div className="quantity-container">
                      <select
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item.productId._id, parseInt(e.target.value))
                        }
                        className="p-2 border rounded-md mb-2 w-16 text-sm cursor-pointer"
                      >
                        {[...Array(selectedSize?.stock).keys()].map((num) => (
                          <option key={num + 1} value={num + 1}>
                            {num + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      className="remove-from-cart-btn"
                      onClick={() => handleRemove(item._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <button
          className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md text-base mt-5 cursor-pointer transition-colors duration-300"
          onClick={() => window.location.href = "/cart"}
        >
          View Cart
        </button>

      </div>
      {showProfilePopup && (
        <ProfilePopup me={user} onClose={() => setShowProfilePopup(false)} fetchUser={fetchUser} />
      )}

    </nav>
  );
};

export default Navbar;
