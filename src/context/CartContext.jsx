import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const CartContext = createContext();

// Custom hook to use the Cart context
const useCart = () => useContext(CartContext);

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/carts/`;
const API_URL_Order = `${import.meta.env.VITE_API_BASE_URL}/orders/`;

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartItem, setCartItem] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user_token = Cookies.get("user_token");

  // Fetch cart items from the backend
  useEffect(() => {
    if (user_token) {
      fetchCart();
    }
  }, [user_token]);

  const fetchCart = async () => {
    try {
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${user_token}`
        }
      });
      if (response.data.cart) {
        setCart(response.data.cart);
        setCartItem(response.data.cart.cartItem);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Add product to cart
  const addToCart = async (product) => {
    try {
      const response = await axios.post(API_URL, {
        productId: product.productID,
        variationId: product.variationId,
        quantity: product.quantity,
        price: product.price,
        totalProductDiscount: product.discount,
      },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user_token}`
          }
        }
      );
      await fetchCart();
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  const updateQuantity = async (id, quantity) => {
    try {
      const response = await axios.put(`${API_URL}${id}`, {
        quantity: quantity,
      }, {
        headers: {
          Authorization: `Bearer ${user_token}`
        }
      });
      await fetchCart();
    }
    catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  // Remove product from cart by ID
  const removeFromCart = async (id) => {
    try {
      const response = await axios.delete(`${API_URL}${id}`, {
        headers: {
          Authorization: `Bearer ${user_token}`
        }
      });
      await fetchCart();
      // setCart(response.data.cart.cartItem); // Assuming API returns an array of cart items
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const placeOrder = async (id) => {
    try {
      const response = await axios.post(`${API_URL_Order}${id}`, { shippingAddress: "AB Road" }, {
        headers: {
          Authorization: `Bearer ${user_token}`
        }
      });
      await fetchCart();
    }
    catch (err) {
      console.error("Error placing order:", err);
    }
  }

  const GetplaceOrder = async () => {
    try {
      const response = await axios.get(`${API_URL_Order}`, {
        headers: {
          Authorization: `Bearer ${user_token}`
        }
      });
      await fetchCart();
    }
    catch (err) {
      console.error("Error placing order:", err);
    }
  }



  return (
    <CartContext.Provider value={{ cart, cartItem, addToCart, removeFromCart, updateQuantity, placeOrder, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export { CartProvider, useCart };
