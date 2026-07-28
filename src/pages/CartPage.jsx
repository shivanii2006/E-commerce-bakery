import React, { useState } from "react";
import { Link } from "react-router-dom";
import Checkout from "./Checkout";

export default function CartPage({ cartItems = [], removeFromCart, updateQuantity, clearCart }) {
  const [showCheckout, setShowCheckout] = useState(false);

  const total = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );

  const handleOrderSuccess = () => {
    setShowCheckout(false);
    if (clearCart) clearCart();
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "40px auto", padding: "0 20px", minHeight: "80vh" }}>
      <h1 style={{ color: "#8b5e34", marginBottom: "30px", textAlign: "center", fontFamily: "'Playfair Display', serif" }}>
        Your Gourmet Cart
      </h1>

      {cartItems.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            background: "white",
            padding: "50px 30px",
            borderRadius: "16px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
          }}
        >
          <span style={{ fontSize: "48px" }}>🛒</span>
          <h2 style={{ color: "#8b5e34", marginTop: "15px" }}>Your cart is empty</h2>
          <p style={{ color: "#666", marginBottom: "25px" }}>Fill it with delicious fresh pastries, cakes, and cookies!</p>
          <Link
            to="/products"
            style={{
              display: "inline-block",
              background: "#8b5e34",
              color: "white",
              padding: "12px 24px",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "600",
              transition: "background-color 0.2s",
            }}
          >
            Explore Our Products
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", gap: "30px", flexWrap: "wrap" }}>
          {/* Cart Items List */}
          <div style={{ flex: "2", minWidth: "300px", display: "grid", gap: "15px" }}>
            {cartItems.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  background: "white",
                  padding: "15px",
                  borderRadius: "16px",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.04)",
                  gap: "20px",
                  position: "relative",
                }}
              >
                {/* Product Thumbnail */}
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: "90px", height: "90px", objectFit: "cover", borderRadius: "12px" }}
                />

                {/* Info & Quantity controls */}
                <div style={{ flexGrow: 1, display: "flex", justifyContent: "space-between", flexWrap: "wrap", alignItems: "center", gap: "15px" }}>
                  <div>
                    <h3 style={{ margin: "0 0 5px 0", color: "#333", fontSize: "18px" }}>{item.name}</h3>
                    <span style={{ fontSize: "13px", color: "#8b5e34", fontWeight: "bold" }}>{item.category}</span>
                  </div>

                  {/* Quantity adjustment */}
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <button
                      onClick={() => updateQuantity(item, (item.quantity || 1) - 1)}
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        border: "1px solid #ddd",
                        background: "#f9f9f9",
                        cursor: "pointer",
                        fontSize: "16px",
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      −
                    </button>
                    <span style={{ fontWeight: "bold", width: "20px", textAlign: "center" }}>{item.quantity || 1}</span>
                    <button
                      onClick={() => updateQuantity(item, (item.quantity || 1) + 1)}
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        border: "1px solid #ddd",
                        background: "#f9f9f9",
                        cursor: "pointer",
                        fontSize: "16px",
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      +
                    </button>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                    <span style={{ fontSize: "18px", fontWeight: "bold", color: "#8b5e34" }}>
                      ₹{(item.price || 0) * (item.quantity || 1)}
                    </span>
                    <span style={{ fontSize: "12px", color: "#888" }}>₹{item.price} each</span>
                  </div>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => removeFromCart(item)}
                  style={{
                    position: "absolute",
                    top: "15px",
                    right: "15px",
                    border: "none",
                    background: "none",
                    color: "#999",
                    cursor: "pointer",
                    fontSize: "18px",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.color = "#c62828")}
                  onMouseOut={(e) => (e.currentTarget.style.color = "#999")}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            <div
              style={{
                background: "white",
                padding: "25px",
                borderRadius: "16px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                position: "sticky",
                top: "100px",
              }}
            >
              <h2 style={{ marginTop: 0, borderBottom: "1px solid #eee", paddingBottom: "15px", color: "#333", fontSize: "20px" }}>
                Order Summary
              </h2>

              <div style={{ display: "flex", justifyContent: "space-between", margin: "15px 0", color: "#666" }}>
                <span>Subtotal</span>
                <span>₹{total}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", margin: "15px 0", color: "#666" }}>
                <span>Delivery Charge</span>
                <span style={{ color: "#2e7d32", fontWeight: "600" }}>FREE</span>
              </div>

              <hr style={{ border: "0", borderTop: "1px dashed #ddd", margin: "15px 0" }} />

              <div style={{ display: "flex", justifyContent: "space-between", margin: "15px 0 25px 0", fontSize: "20px", fontWeight: "bold" }}>
                <span style={{ color: "#333" }}>Total Amount</span>
                <span style={{ color: "#8b5e34" }}>₹{total}</span>
              </div>

              <button
                onClick={() => setShowCheckout(true)}
                style={{
                  width: "100%",
                  padding: "14px",
                  background: "#8b5e34",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "16px",
                  transition: "background-color 0.2s",
                }}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Popup */}
      {showCheckout && (
        <Checkout
          cartItems={cartItems}
          total={total}
          onClose={() => setShowCheckout(false)}
          onOrderSuccess={handleOrderSuccess}
        />
      )}
    </div>
  );
}
