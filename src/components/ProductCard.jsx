import React from "react";
import "../index.css";

export default function ProductCard({ product }) {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p className="price">₹{product.price}</p>
      <button>Add to Cart</button>
    </div>
  );
}
