import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CartPage from "./pages/CartPage";

import Header from "./components/Header";
import Footer from "./components/Footer";




import LandingPage from "./pages/LandingPage";
import ProductsPage from "./pages/ProductsPage";
import LoginPage from "./pages/LoginPage";
import ProductDetailPage from "./pages/ProductDetailPage";


function App() {
  const [searchQuery, setSearchQuery] = useState("");

  // Cart state
  const [cartItems, setCartItems] = useState([]);

  // Add to cart
  const addToCart = (product) => {
    setCartItems([...cartItems, product]);
  };

  // Remove from cart
  const removeFromCart = (product) => {
    setCartItems(cartItems.filter((item) => item.id !== product.id));
  };
  const updateQuantity = (product, newQuantity) => {
  if (newQuantity < 1) return; // prevent going below 1
  setCartItems(
    cartItems.map((item) =>
      item.name === product.name ? { ...item, quantity: newQuantity } : item
    )
  );
};


  return (
    <Router>
      {/* Header stays unchanged */}
      <Header setSearchQuery={setSearchQuery} />

      <Routes>
       
        <Route path="/" element={<LandingPage searchQuery={searchQuery} />} />
        <Route path="/products" element={<ProductsPage searchQuery={searchQuery} />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Product detail page */}
        <Route path="/product/:slug" element={<ProductDetailPage addToCart={addToCart} />} />

        {/* Cart page */}
        <Route path="/cart" element={ <CartPage
      cartItems={cartItems}
      removeFromCart={removeFromCart}
      updateQuantity={updateQuantity}
    />
  }
/>


        {/* If you also want to support :productName instead of :slug */}
        <Route path="/product/:productName" element={<ProductDetailPage addToCart={addToCart} />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
