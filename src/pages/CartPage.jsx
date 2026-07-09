import React, { useState } from "react";
import Checkout from "./Checkout"; // adjust path if your Checkout.jsx is elsewhere

export default function CartPage({ cartItems = [], removeFromCart, updateQty }) {
  const [showCheckout, setShowCheckout] = useState(false);

  const total = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );

  const styles = {
    container: {
      maxWidth: 960,
      margin: "40px auto",
      padding: "0 16px",
    },
    title: {
      color: "#8b5e34",
      marginBottom: 16,
      textAlign: "center",
    },
    empty: {
      textAlign: "center",
      background: "#fff",
      padding: 24,
      borderRadius: 12,
      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    },
    list: {
      display: "grid",
      gap: 12,
    },
    item: {
      display: "grid",
      gridTemplateColumns: "64px 1fr auto auto auto",
      alignItems: "center",
      gap: 12,
      background: "#fff",
      padding: 12,
      borderRadius: 12,
      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    },
    thumb: {
      width: 64,
      height: 64,
      objectFit: "cover",
      borderRadius: 8,
    },
    name: { fontWeight: 600 },
    price: { fontWeight: 600, color: "#8b5e34" },
    qtyBox: { display: "flex", alignItems: "center", gap: 8 },
    qtyBtn: {
      width: 28,
      height: 28,
      borderRadius: 8,
      border: "1px solid #ddd",
      background: "#fafafa",
      cursor: "pointer",
    },
    removeBtn: {
      border: "none",
      background: "#ffe9e6",
      color: "#b43b2e",
      padding: "6px 10px",
      borderRadius: 8,
      cursor: "pointer",
    },
    summary: {
      marginTop: 20,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      background: "#fff",
      padding: "14px 18px",
      borderRadius: 12,
      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    },
    totalText: { fontSize: 18, fontWeight: 700, color: "#4a3b2a" },
    checkoutBtn: {
      background: "#af4c0f",
      color: "#fff",
      border: "none",
      padding: "10px 16px",
      borderRadius: 10,
      cursor: "pointer",
      fontWeight: 600,
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Your Cart</h2>

      {cartItems.length === 0 ? (
        <div style={styles.empty}>Your cart is empty.</div>
      ) : (
        <>
          <div style={styles.list}>
            {cartItems.map((item, idx) => (
              <div key={idx} style={styles.item}>
                {/* Thumbnail if available */}
                {item.image ? (
                  <img src={item.image} alt={item.name} style={styles.thumb} />
                ) : (
                  <div
                    style={{
                      ...styles.thumb,
                      background: "#f2f2f2",
                      display: "grid",
                      placeItems: "center",
                      fontSize: 12,
                      color: "#888",
                    }}
                  >
                    No Image
                  </div>
                )}

                {/* Name */}
                <div style={styles.name}>{item.name}</div>

                {/* Price */}
                <div style={styles.price}>₹{item.price || 0}</div>

                {/* Quantity (uses your updateQty if you have it) */}
                <div style={styles.qtyBox}>
                  {typeof updateQty === "function" ? (
                    <>
                      <button
                        style={styles.qtyBtn}
                        onClick={() => updateQty(item, "dec")}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span>{item.quantity || 1}</span>
                      <button
                        style={styles.qtyBtn}
                        onClick={() => updateQty(item, "inc")}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </>
                  ) : (
                    <span>Qty: {item.quantity || 1}</span>
                  )}
                </div>

                {/* Remove (uses your removeFromCart if you have it) */}
                <div>
                  {typeof removeFromCart === "function" && (
                    <button
                      style={styles.removeBtn}
                      onClick={() => removeFromCart(item)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Summary + Checkout */}
          <div style={styles.summary}>
            <div style={styles.totalText}>Total: ₹{total}</div>
            <button
              style={styles.checkoutBtn}
              onClick={() => setShowCheckout(true)}
            >
              Checkout
            </button>
          </div>
        </>
      )}

      {/* ✅ Popup Checkout (modal) */}
      {showCheckout && <Checkout onClose={() => setShowCheckout(false)} />}
    </div>
  );
}
