import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";
import SearchBar from "./SearchBar";

function Header({ setSearchQuery, user, onLogout, cartItems = [] }) {
  const navigate = useNavigate();
  const cartCount = cartItems.reduce((count, item) => count + (item.quantity || 1), 0);

  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout();
      navigate("/");
    }
  };

  return (
    <header className="app-header">
      {/* Logo */}
      <Link to="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
        <img
          src={logo}
          alt="Bakery Logo"
          style={{ height: "60px", borderRadius: "8px", border: "2px solid white" }}
        />
        <span style={{ color: "white", fontWeight: "bold", fontSize: "22px", fontFamily: "'Playfair Display', serif" }}>
          Sweet Treats
        </span>
      </Link>

      {/* Navigation */}
      <nav style={{ display: "flex", gap: "30px", alignItems: "center" }}>
        <Link
          to="/"
          style={{
            fontSize: "18px",
            color: "white",
            textDecoration: "none",
            fontWeight: "500",
            transition: "color 0.2s",
          }}
        >
          Home
        </Link>
        <Link
          to="/products"
          style={{
            fontSize: "18px",
            color: "white",
            textDecoration: "none",
            fontWeight: "500",
            transition: "color 0.2s",
          }}
        >
          Our Products
        </Link>

        {user && user.role === "admin" && (
          <Link
            to="/admin"
            style={{
              fontSize: "18px",
              color: "#ffdd93",
              textDecoration: "none",
              fontWeight: "600",
              transition: "color 0.2s",
            }}
          >
            Admin Dashboard
          </Link>
        )}
      </nav>

      {/* Search + Cart + User Auth */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        {/* 🔍 Search Bar Component */}
        <SearchBar setSearchQuery={setSearchQuery} />

        {/* 🛒 Cart Button */}
        <Link to="/cart" style={{ textDecoration: "none" }}>
          <button
            style={{
              padding: "10px 18px",
              border: "none",
              borderRadius: "20px",
              background: "#ffdd93",
              color: "#3e2c1c",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "transform 0.2s, background-color 0.2s",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#ffe7b3";
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "#ffdd93";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <span>🛒</span>
            {cartCount > 0 && (
              <span
                style={{
                  background: "#af4c0f",
                  color: "white",
                  borderRadius: "50%",
                  padding: "2px 6px",
                  fontSize: "12px",
                  display: "inline-block",
                }}
              >
                {cartCount}
              </span>
            )}
          </button>
        </Link>

        {/* User Info / Logout / Login */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "14px", color: "#ffdd93" }}>Hi, {user.name.split(" ")[0]}</span>
              <button
                onClick={handleLogoutClick}
                style={{
                  padding: "6px 12px",
                  background: "transparent",
                  border: "1px solid white",
                  borderRadius: "6px",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "14px",
                  transition: "background-color 0.2s, color 0.2s",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "white";
                  e.currentTarget.style.color = "#8b5e34";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "white";
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" style={{ textDecoration: "none" }}>
              <button
                style={{
                  padding: "8px 16px",
                  background: "white",
                  border: "none",
                  borderRadius: "6px",
                  color: "#8b5e34",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "transform 0.2s",
                }}
                onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                Login
              </button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
