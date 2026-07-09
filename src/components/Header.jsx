import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.jpg";

function Header({ setSearchQuery }) {
  return (
    <header
      style={{
        background: "#af4c0f",
        padding: "15px 40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        color: "white",
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <img
          src={logo}
          alt="Bakery Logo"
          style={{ height: "80px", borderRadius: "8px" }}
        />
      </div>

      {/* Navigation */}
      <nav style={{ flexGrow: 1, textAlign: "center" }}>
        <Link
          to="/"
          style={{
            fontSize: "20px", // ⬆ increased size
            margin: "0 80px",
            color: "white",
            textDecoration: "none",
            fontWeight: "500",
          }}
        >
          Home
        </Link>
        <Link
          to="/products"
          style={{
            fontSize: "20px", // ⬆ increased size
            margin: "0 80px",
            color: "white",
            textDecoration: "none",
            fontWeight: "500",
          }}
        >
          Our Products
        </Link>
        <Link
          to="/login"
          style={{
            fontSize: "20px", // ⬆ increased size
            margin: "0 80px",
            color: "white",
            textDecoration: "none",
            fontWeight: "500",
          }}
        >
          Login
        </Link>
      </nav>

      {/* Search + Cart */}
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        {/* 🔍 Search Bar */}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
          }}
        >
          <span
            style={{
              position: "absolute",
              left: "12px",
              color: "white",
              fontSize: "16px",
            }}
          >
            🔍
          </span>
          <input
            type="text"
            placeholder="Search for anything"
            onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
            style={{
              padding: "10px 175px 10px 35px", // left padding for emoji
              borderRadius: "25px", // makes it oval
              border: "1px solid white",
              background: "transparent", // transparent box
              color: "white",
              outline: "none",
              fontSize: "16px",
              width: "220px",
            }}
          />
        </div>

        {/* 🛒 Cart Button */}
        <Link to="/cart">
          <button
            style={{
              padding: "8px 16px",
              border: "none",
              borderRadius: "20px",
              background: "#ffdd93ff",
              color: "#000000ff",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "0.3s",
            }}
          >
            🛒
          </button>
        </Link>
      </div>
    </header>
  );
}

export default Header;
