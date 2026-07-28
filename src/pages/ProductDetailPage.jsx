import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { STATIC_PRODUCTS, getResolvedImage } from "./ProductsPage";

function ProductDetailPage({ addToCart }) {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${slug}`);
        if (res.ok) {
          const data = await res.json();
          // Resolve image path to bundled local high-quality file if matching
          const resolvedProduct = {
            ...data,
            image: getResolvedImage(data.image, data.slug)
          };
          setProduct(resolvedProduct);
        } else {
          // If server failed, fallback offline
          console.warn("Product API failed. Falling back to offline details.");
          const fallback = STATIC_PRODUCTS.find(p => p.slug === slug);
          setProduct(fallback || null);
        }
      } catch (error) {
        console.error("Error fetching product detail, falling back offline:", error);
        const fallback = STATIC_PRODUCTS.find(p => p.slug === slug);
        setProduct(fallback || null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  const handleAdd = () => {
    if (!product) return;
    const cartProduct = {
      ...product,
      quantity: quantity
    };
    addToCart(cartProduct);
    setAdded(true);
    setTimeout(() => setAdded(false), 3000);
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "100px 20px", fontSize: "18px", color: "#8b5e34" }}>
        Loading pastry details...
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px" }}>
        <h2 style={{ color: "#c62828" }}>Pastry Not Found</h2>
        <p>The product you are looking for does not exist or has been removed.</p>
        <Link to="/products" style={{ color: "#8b5e34", fontWeight: "600", textDecoration: "none" }}>
          ← Back to Products
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;

  return (
    <div style={{ padding: "40px 20px", maxWidth: "1000px", margin: "0 auto", minHeight: "80vh" }}>
      <Link to="/products" style={{ textDecoration: "none", color: "#8b5e34", fontWeight: "600", display: "inline-flex", alignItems: "center", gap: "5px" }}>
        ← Back to Products
      </Link>

      <div style={{ display: "flex", gap: "50px", marginTop: "30px", flexWrap: "wrap" }}>
        {/* Left Column: Image */}
        <div style={{ flex: "1", minWidth: "300px" }}>
          <div
            style={{
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
              background: "white",
              position: "relative",
            }}
          >
            <img
              src={product.image}
              alt={product.name}
              className="detail-image"
              style={{ width: "100%", height: "450px", objectFit: "cover", display: "block" }}
            />
            {isOutOfStock && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: "rgba(0,0,0,0.5)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "white",
                  fontSize: "24px",
                  fontWeight: "bold",
                }}
              >
                SOLD OUT
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Specs */}
        <div style={{ flex: "1.2", minWidth: "300px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <span style={{ fontSize: "14px", textTransform: "uppercase", color: "#8b5e34", fontWeight: "bold" }}>
              {product.category}
            </span>
            <h2 style={{ margin: "5px 0 10px", color: "#333", fontSize: "32px", fontFamily: "'Playfair Display', serif" }}>
              {product.name}
            </h2>

            {/* Ratings and Reviews */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
              <div style={{ color: "#ffc107", fontSize: "18px" }}>★★★★★</div>
              <span style={{ fontSize: "14px", color: "#666" }}>(4.8/5 • 42 reviews)</span>
            </div>

            <div style={{ fontSize: "28px", fontWeight: "bold", color: "#8b5e34", marginBottom: "20px" }}>
              ₹{product.price}
            </div>

            <p style={{ color: "#555", lineHeight: "1.6", fontSize: "16px", marginBottom: "25px" }}>
              {product.details}
            </p>

            {/* Product Details Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "15px",
                padding: "20px",
                background: "white",
                borderRadius: "12px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
                marginBottom: "25px",
              }}
            >
              <div><strong>🥚 Eggless:</strong> {product.eggless}</div>
              <div><strong>⚖️ Weight:</strong> {product.weight || "N/A"}</div>
              <div><strong>👥 Serves:</strong> {product.serves || "N/A"}</div>
              <div><strong>📅 Shelf life:</strong> {product.shelfLife || "N/A"}</div>
              <div style={{ gridColumn: "1 / -1" }}>
                <strong>⚠️ Allergens:</strong> {product.allergens || "None declared"}
              </div>
            </div>
          </div>

          <div>
            {/* Stock status */}
            <div style={{ marginBottom: "15px" }}>
              <span style={{ fontSize: "15px", fontWeight: "600", color: isOutOfStock ? "#c62828" : "#2e7d32" }}>
                {isOutOfStock ? "❌ Out of Stock" : `✓ In Stock (${product.stock || 10} available)`}
              </span>
            </div>

            {/* Quantity Selector */}
            {!isOutOfStock && (
              <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "20px" }}>
                <span style={{ color: "#555", fontWeight: "500" }}>Quantity:</span>
                <div style={{ display: "flex", alignItems: "center", border: "1px solid #ddd", borderRadius: "8px", overflow: "hidden" }}>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{ padding: "8px 12px", border: "none", background: "#f5f5f5", cursor: "pointer", fontWeight: "bold" }}
                  >
                    −
                  </button>
                  <span style={{ padding: "0 15px", fontWeight: "bold" }}>{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock || 10, quantity + 1))}
                    style={{ padding: "8px 12px", border: "none", background: "#f5f5f5", cursor: "pointer", fontWeight: "bold" }}
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
              <button
                onClick={handleAdd}
                disabled={isOutOfStock}
                style={{
                  padding: "15px 30px",
                  background: isOutOfStock ? "#ccc" : "#8b5e34",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: isOutOfStock ? "not-allowed" : "pointer",
                  fontWeight: 600,
                  fontSize: "16px",
                  flex: "1",
                  transition: "background-color 0.2s",
                }}
              >
                {isOutOfStock ? "Out of Stock" : "Add to Cart"}
              </button>

              {added && (
                <div style={{ flex: "1" }}>
                  <span style={{ color: "#2e7d32", fontWeight: "600", marginRight: "10px" }}>✓ Added!</span>
                  <Link
                    to="/cart"
                    style={{
                      color: "#8b5e34",
                      fontWeight: "bold",
                      textDecoration: "underline",
                    }}
                  >
                    View Cart →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;
