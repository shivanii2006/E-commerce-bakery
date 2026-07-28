import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Import local image assets for fallback & resolution guarantee
import chocolateCake from "../assets/chocolate-cake.jpg";
import blackForest from "../assets/black-forest.jpg";
import whiteForest from "../assets/white-forest.jpg";
import cheesecake from "../assets/cheesecake.jpg";
import croissant from "../assets/croissant.jpg";
import cookies from "../assets/cookies.jpg";

const IMAGE_MAP = {
  "chocolate-cake": chocolateCake,
  "black-forest": blackForest,
  "white-forest": whiteForest,
  "cheese-cake": cheesecake,
  "croissant": croissant,
  "cookies": cookies,
};

// Seeding standard local products array
export const STATIC_PRODUCTS = [
  {
    id: 1,
    name: "Chocolate Cake",
    slug: "chocolate-cake",
    category: "Cakes",
    image: chocolateCake,
    price: 500,
    details: "Rich and moist chocolate delight.",
    eggless: "Yes",
    weight: "1 kg",
    serves: "8 people",
    shelfLife: "3 days (refrigerated)",
    allergens: "Wheat, Dairy",
    stock: 15,
  },
  {
    id: 2,
    name: "Black Forest",
    slug: "black-forest",
    category: "Cakes",
    image: blackForest,
    price: 600,
    details: "Classic black forest with cherries and cream.",
    eggless: "No",
    weight: "1 kg",
    serves: "8 people",
    shelfLife: "2 days (refrigerated)",
    allergens: "Wheat, Dairy, Eggs",
    stock: 10,
  },
  {
    id: 3,
    name: "White Forest",
    slug: "white-forest",
    category: "Cakes",
    image: whiteForest,
    price: 550,
    details: "Light & fluffy white forest cake.",
    eggless: "Yes",
    weight: "1 kg",
    serves: "8 people",
    shelfLife: "2 days (refrigerated)",
    allergens: "Wheat, Dairy",
    stock: 12,
  },
  {
    id: 4,
    name: "Cheese Cake",
    slug: "cheese-cake",
    category: "Cakes",
    image: cheesecake,
    price: 700,
    details: "Creamy New York-style cheesecake.",
    eggless: "Yes",
    weight: "500 g",
    serves: "4 people",
    shelfLife: "3 days (refrigerated)",
    allergens: "Wheat, Dairy",
    stock: 8,
  },
  {
    id: 5,
    name: "Croissant",
    slug: "croissant",
    category: "Croissants",
    image: croissant,
    price: 150,
    details: "Flaky, buttery croissant baked fresh daily.",
    eggless: "No",
    weight: "100 g",
    serves: "1 person",
    shelfLife: "1 day",
    allergens: "Wheat, Dairy, Eggs",
    stock: 25,
  },
  {
    id: 6,
    name: "Cookies",
    slug: "cookies",
    category: "Cookies",
    image: cookies,
    price: 200,
    details: "Crunchy chocolate-chip cookies.",
    eggless: "Yes",
    weight: "250 g",
    serves: "5 people",
    shelfLife: "5 days (airtight)",
    allergens: "Wheat, Dairy",
    stock: 30,
  }
];

export const getResolvedImage = (imagePath, slug) => {
  // If slug matches our static keys, return the bundled local file directly
  if (slug && IMAGE_MAP[slug]) {
    return IMAGE_MAP[slug];
  }
  // If image path contains cake name, return bundled file
  for (const key of Object.keys(IMAGE_MAP)) {
    if (imagePath && imagePath.includes(key)) {
      return IMAGE_MAP[key];
    }
  }
  return imagePath;
};

function ProductsPage({ searchQuery }) {
  const [products, setProducts] = useState(STATIC_PRODUCTS); // fallback starts as initial state
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const url = `/api/products?search=${encodeURIComponent(searchQuery)}`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          // Map backend products to use bundled local high-quality images if matching
          const mapped = data.map(item => ({
            ...item,
            image: getResolvedImage(item.image, item.slug)
          }));
          
          if (mapped.length > 0) {
            setProducts(mapped);
          } else if (!searchQuery) {
            // fallback to static products if API succeeded but DB is empty
            setProducts(STATIC_PRODUCTS);
          } else {
            setProducts([]);
          }
        } else {
          // If server responded with error, use client-side static products
          console.warn("Backend API responded with error. Falling back to offline catalog.");
          setProducts(STATIC_PRODUCTS.filter(p => 
            p.name.toLowerCase().includes(searchQuery.toLowerCase())
          ));
        }
      } catch (error) {
        console.error("Error fetching products, falling back to static offline copy:", error);
        setProducts(STATIC_PRODUCTS.filter(p => 
          p.name.toLowerCase().includes(searchQuery.toLowerCase())
        ));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery]);

  // Categories list
  const categories = ["All", "Cakes", "Croissants", "Cookies"];

  // Filter and Sort products
  const filteredProducts = products
    .filter((p) => selectedCategory === "All" || p.category === selectedCategory)
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      return 0;
    });

  return (
    <div style={{ padding: "40px 20px", maxWidth: "1200px", margin: "0 auto", minHeight: "80vh" }}>
      <h1 style={{ textAlign: "center", color: "#8b5e34", marginBottom: "10px", fontFamily: "'Playfair Display', serif" }}>
        Our Pastry & Dessert Collection
      </h1>
      <p style={{ textAlign: "center", color: "#666", marginBottom: "40px" }}>
        Freshly baked everyday with premium organic ingredients
      </p>

      {/* Filters and Sorting Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "15px",
          marginBottom: "30px",
          background: "white",
          padding: "15px 25px",
          borderRadius: "12px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        }}
      >
        {/* Category Buttons */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: "8px 16px",
                borderRadius: "20px",
                border: selectedCategory === cat ? "none" : "1px solid #ddd",
                background: selectedCategory === cat ? "#8b5e34" : "transparent",
                color: selectedCategory === cat ? "white" : "#555",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sorting Dropdown */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ color: "#666", fontSize: "14px" }}>Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              background: "white",
              outline: "none",
              color: "#333",
              fontWeight: "500",
              cursor: "pointer",
            }}
          >
            <option value="default">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "40px", fontSize: "18px", color: "#8b5e34" }}>
          Loading gourmet treats...
        </div>
      ) : filteredProducts.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px", background: "white", borderRadius: "12px" }}>
          <span style={{ fontSize: "40px" }}>🍪</span>
          <h3 style={{ color: "#8b5e34", marginTop: "15px" }}>No items found</h3>
          <p style={{ color: "#666" }}>Try searching for something else or explore another category.</p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "30px",
          }}
        >
          {filteredProducts.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.slug}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div
                style={{
                  background: "white",
                  borderRadius: "16px",
                  overflow: "hidden",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  cursor: "pointer",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.12)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.06)";
                }}
              >
                {/* Image Container */}
                <div style={{ position: "relative", height: "240px", overflow: "hidden" }}>
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.5s",
                    }}
                  />
                  {product.stock <= 0 ? (
                    <div
                      style={{
                        position: "absolute",
                        top: "15px",
                        right: "15px",
                        background: "#d32f2f",
                        color: "white",
                        padding: "5px 12px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}
                    >
                      Sold Out
                    </div>
                  ) : product.stock <= 5 ? (
                    <div
                      style={{
                        position: "absolute",
                        top: "15px",
                        right: "15px",
                        background: "#ef6c00",
                        color: "white",
                        padding: "5px 12px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}
                    >
                      Only {product.stock} Left!
                    </div>
                  ) : null}
                </div>

                {/* Content */}
                <div style={{ padding: "20px", flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <span style={{ fontSize: "12px", textTransform: "uppercase", color: "#8b5e34", fontWeight: "bold" }}>
                      {product.category}
                    </span>
                    <h3 style={{ margin: "5px 0 10px 0", fontSize: "18px", color: "#333" }}>{product.name}</h3>
                    <p style={{ fontSize: "14px", color: "#666", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", height: "40px" }}>
                      {product.details}
                    </p>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "15px" }}>
                    <span style={{ fontSize: "20px", fontWeight: "bold", color: "#8b5e34" }}>
                      ₹{product.price}
                    </span>
                    <span style={{ fontSize: "13px", color: (product.stock === undefined || product.stock > 0) ? "#2e7d32" : "#c62828", fontWeight: "600" }}>
                      {(product.stock === undefined || product.stock > 0) ? "✓ In Stock" : "✗ Out of Stock"}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductsPage;
