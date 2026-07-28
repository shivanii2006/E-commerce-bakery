import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import LandingPage from "./pages/LandingPage";
import ProductsPage from "./pages/ProductsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import AdminDashboard from "./pages/AdminDashboard";

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // User Authentication state
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Cart state persisted in localStorage
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Session verification on mount
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await fetch("/api/auth/me", {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          if (res.ok) {
            const data = await res.json();
            setUser(data.user);
            localStorage.setItem("user", JSON.stringify(data.user));
          } else {
            // Token expired or invalid
            handleLogout();
          }
        } catch (err) {
          console.error("Token verification failed:", err);
        }
      }
    };
    verifyToken();
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  // Add to cart with duplicate merging
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === product.id);
      const qtyToAdd = product.quantity || 1;
      if (existing) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity || 1) + qtyToAdd }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: qtyToAdd }];
    });
  };

  // Remove from cart
  const removeFromCart = (product) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== product.id && item.name !== product.name)
    );
  };

  // Update Quantity
  const updateQuantity = (product, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === product.id || item.name === product.name
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  // Clear Cart
  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <Router>
      {/* Header with Search and Auth context */}
      <Header
        setSearchQuery={setSearchQuery}
        user={user}
        onLogout={handleLogout}
        cartItems={cartItems}
      />

      <Routes>
        {/* Core Storefront Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/products" element={<ProductsPage searchQuery={searchQuery} />} />
        <Route path="/product/:slug" element={<ProductDetailPage addToCart={addToCart} />} />
        
        {/* Authentication Routes */}
        <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/register" element={<RegisterPage onLoginSuccess={handleLoginSuccess} />} />

        {/* Cart Page */}
        <Route
          path="/cart"
          element={
            <CartPage
              cartItems={cartItems}
              removeFromCart={removeFromCart}
              updateQuantity={updateQuantity}
              clearCart={clearCart}
            />
          }
        />

        {/* Admin Dashboard */}
        <Route path="/admin" element={<AdminDashboard user={user} />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
