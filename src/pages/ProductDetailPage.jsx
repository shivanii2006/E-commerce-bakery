import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";

// Import the same images you already use elsewhere
import chocolateCake from "../assets/chocolate-cake.jpg";
import blackForest from "../assets/black-forest.jpg";
import whiteForest from "../assets/white-forest.jpg";
import cheesecake from "../assets/cheesecake.jpg";
import croissant from "../assets/croissant.jpg";
import cookies from "../assets/cookies.jpg";

// Keep a local copy of products so we DON'T touch your existing pages
const products = [
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
  },
];

function ProductDetailPage({ addToCart }) {
  // Support either :slug or :productName param (so you don’t need to rename your routes)
  const params = useParams();
  const paramValue = (params.slug || params.productName || params.name || "").toLowerCase();

  const product = products.find(
    (p) =>
      p.slug === paramValue ||
      p.name.toLowerCase().replace(/\s+/g, "-") === paramValue
  );

  const [added, setAdded] = useState(false);

  if (!product) return <h2 style={{ padding: "40px" }}>Product not found</h2>;

  const handleAdd = () => {
    addToCart(product);
    setAdded(true);
  };

  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
      <Link to="/products" style={{ textDecoration: "none", color: "#8b5e34" }}>
        ← Back to Products
      </Link>

      <div style={{ display: "flex", gap: "30px", marginTop: "20px", flexWrap: "wrap" }}>
        <img
          src={product.image}
          alt={product.name}
          style={{ width: "340px", height: "340px", objectFit: "cover", borderRadius: "10px" }}
        />

        <div style={{ flex: 1, minWidth: "260px" }}>
          <h2 style={{ margin: "0 0 10px", color: "#8b5e34" }}>{product.name}</h2>
          <p style={{ margin: "0 0 4px", color: "#555" }}>{product.category}</p>
          <p style={{ fontWeight: "bold", fontSize: "20px", margin: "10px 0" }}>₹{product.price}</p>
          <p style={{ margin: "10px 0 20px" }}>{product.details}</p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "20px" }}>
            <div><strong>Eggless:</strong> {product.eggless}</div>
            <div><strong>Weight:</strong> {product.weight}</div>
            <div><strong>Serves:</strong> {product.serves}</div>
            <div><strong>Shelf life:</strong> {product.shelfLife}</div>
            <div style={{ gridColumn: "1 / -1" }}>
              <strong>Allergens:</strong> {product.allergens}
            </div>
          </div>

          <button
            onClick={handleAdd}
            style={{
              padding: "10px 20px",
              background: "#9f672cff",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Add to Cart
          </button>

          {added && (
            <div style={{ marginTop: "12px" }}>
              <span style={{ marginRight: "10px", color: "#2e7d32" }}>Added!</span>
              {/* Since you don't want to touch the header, give a View Cart link here */}
              <Link to="/cart" style={{ color: "#8b5e34" }}>View Cart →</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;
