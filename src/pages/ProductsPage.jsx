import React from "react";
import chocolateCake from "../assets/chocolate-cake.jpg";
import blackForest from "../assets/black-forest.jpg";
import whiteForest from "../assets/white-forest.jpg";
import cheesecake from "../assets/cheesecake.jpg";
import croissant from "../assets/croissant.jpg";
import cookies from "../assets/cookies.jpg";
import { Link } from "react-router-dom";

const products = [
  { name: "Chocolate Cake", category: "Cakes", image: chocolateCake },
  { name: "Black Forest", category: "Cakes", image: blackForest },
  { name: "White Forest", category: "Cakes", image: whiteForest },
  { name: "Cheese Cake", category: "Cakes", image: cheesecake },
  { name: "Croissant", category: "Croissants", image: croissant },
  { name: "Cookies", category: "Cookies", image: cookies },
];

function ProductsPage({ searchQuery }) {
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery)
  );

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h2 style={{ marginBottom: "30px", color: "#8b5e34" }}>All Products</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px", // closer together
          justifyItems: "center",
          padding: "0 20px", // left and right spacing
        }}
      >
        {filteredProducts.map((product, index) => (
          <Link
            key={index}
            to={`/product/${product.name.toLowerCase().replace(/\s+/g, '-')}`}
            style={{ textDecoration: "none" }}
          >
            <div
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "15px",
                background: "white",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                width: "200px",
                textAlign: "center",
                color: "inherit",
              }}
            >
              <img
                src={product.image}
                alt={product.name}
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />
              <h3 style={{ marginTop: "10px", color: "#333" }}>{product.name}</h3>
              <p style={{ color: "#777" }}>{product.category}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ProductsPage;
export const productList = products;
