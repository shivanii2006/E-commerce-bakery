import React, { useState, useEffect, useCallback } from "react";

export default function AdminDashboard({ user }) {
  const [activeTab, setActiveTab] = useState("stats");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Modals state
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: "",
    category: "Cakes",
    price: "",
    details: "",
    eggless: "Yes",
    weight: "",
    serves: "",
    shelfLife: "",
    allergens: "",
    stock: "10",
    featured: false,
    imageFile: null
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Token for authenticated API calls
  const token = localStorage.getItem("token");

  const fetchProducts = useCallback(async () => {
    setLoadingProducts(true);
    try {
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error("Error fetching admin products:", err);
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    setLoadingOrders(true);
    try {
      const res = await fetch("/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error("Error fetching admin orders:", err);
    } finally {
      setLoadingOrders(false);
    }
  }, [token]);

  // Fetch products and orders if user is admin
  useEffect(() => {
    if (user && user.role === "admin") {
      fetchProducts();
      fetchOrders();
    }
  }, [user, fetchProducts, fetchOrders]);

  // Handle product form input change
  const handleProductInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductForm({
      ...productForm,
      [name]: type === "checkbox" ? checked : value
    });
  };

  // Handle image upload input
  const handleFileChange = (e) => {
    setProductForm({
      ...productForm,
      imageFile: e.target.files[0]
    });
  };

  // Open modal to add product
  const handleAddProductClick = () => {
    setEditingProduct(null);
    setProductForm({
      name: "",
      category: "Cakes",
      price: "",
      details: "",
      eggless: "Yes",
      weight: "",
      serves: "",
      shelfLife: "",
      allergens: "",
      stock: "10",
      featured: false,
      imageFile: null
    });
    setError("");
    setShowProductModal(true);
  };

  // Open modal to edit product
  const handleEditProductClick = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      category: prod.category,
      price: prod.price.toString(),
      details: prod.details || "",
      eggless: prod.eggless || "Yes",
      weight: prod.weight || "",
      serves: prod.serves || "",
      shelfLife: prod.shelfLife || "",
      allergens: prod.allergens || "",
      stock: prod.stock.toString(),
      featured: prod.featured === 1 || prod.featured === true,
      imageFile: null // reset image file to upload anew if desired
    });
    setError("");
    setShowProductModal(true);
  };

  // Submit product (create or update)
  const handleProductFormSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("name", productForm.name);
    formData.append("category", productForm.category);
    formData.append("price", productForm.price);
    formData.append("details", productForm.details);
    formData.append("eggless", productForm.eggless);
    formData.append("weight", productForm.weight);
    formData.append("serves", productForm.serves);
    formData.append("shelfLife", productForm.shelfLife);
    formData.append("allergens", productForm.allergens);
    formData.append("stock", productForm.stock);
    formData.append("featured", productForm.featured);
    if (productForm.imageFile) {
      formData.append("image", productForm.imageFile);
    }

    const url = editingProduct ? `/api/products/${editingProduct.id}` : "/api/products";
    const method = editingProduct ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method: method,
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(editingProduct ? "Product updated successfully!" : "Product added successfully!");
        setShowProductModal(false);
        fetchProducts();
      } else {
        setError(data.message || "Something went wrong.");
      }
    } catch (err) {
      console.error("Product submit failed:", err);
      setError("Server communication failed.");
    }
  };

  // Delete product
  const handleDeleteProductClick = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.ok) {
        setSuccess("Product deleted successfully!");
        fetchProducts();
      } else {
        const data = await res.json();
        setError(data.message || "Failed to delete product.");
      }
    } catch (err) {
      console.error("Delete failed:", err);
      setError("Server connection failed.");
    }
  };

  // Update order status
  const handleOrderStatusChange = async (orderId, newStatus) => {
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        setSuccess(`Order #${orderId} status updated to ${newStatus}`);
        fetchOrders();
      } else {
        const data = await res.json();
        setError(data.message || "Failed to update order status.");
      }
    } catch (err) {
      console.error("Order status update failed:", err);
      setError("Server connection error.");
    }
  };

  // Calculations for Stats
  const totalSales = orders
    .filter(o => o.status !== "Cancelled")
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter(o => o.status === "Pending").length;
  const lowStockProductsCount = products.filter(p => p.stock <= 5).length;

  return (
    <div style={{ maxWidth: "1200px", margin: "40px auto", padding: "0 20px", minHeight: "80vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h1 style={{ color: "#8b5e34", margin: 0, fontFamily: "'Playfair Display', serif" }}>
          Admin Management Portal
        </h1>
        <div style={{ fontSize: "14px", color: "#666" }}>Logged in as: <strong>{user?.name}</strong></div>
      </div>

      {/* Messages */}
      {success && (
        <div style={{ padding: "12px", background: "#e8f5e9", color: "#2e7d32", borderRadius: "8px", marginBottom: "20px", fontWeight: "600" }}>
          ✓ {success}
        </div>
      )}
      {error && (
        <div style={{ padding: "12px", background: "#ffebee", color: "#c62828", borderRadius: "8px", marginBottom: "20px", fontWeight: "600" }}>
          ⚠️ {error}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "2px solid #ddd", marginBottom: "30px" }}>
        <button
          onClick={() => setActiveTab("stats")}
          style={{
            padding: "12px 25px",
            background: "transparent",
            border: "none",
            borderBottom: activeTab === "stats" ? "3px solid #8b5e34" : "none",
            color: activeTab === "stats" ? "#8b5e34" : "#666",
            fontWeight: "bold",
            fontSize: "16px",
            cursor: "pointer"
          }}
        >
          📊 Business Performance
        </button>
        <button
          onClick={() => setActiveTab("products")}
          style={{
            padding: "12px 25px",
            background: "transparent",
            border: "none",
            borderBottom: activeTab === "products" ? "3px solid #8b5e34" : "none",
            color: activeTab === "products" ? "#8b5e34" : "#666",
            fontWeight: "bold",
            fontSize: "16px",
            cursor: "pointer"
          }}
        >
          🍰 Product Inventory
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          style={{
            padding: "12px 25px",
            background: "transparent",
            border: "none",
            borderBottom: activeTab === "orders" ? "3px solid #8b5e34" : "none",
            color: activeTab === "orders" ? "#8b5e34" : "#666",
            fontWeight: "bold",
            fontSize: "16px",
            cursor: "pointer"
          }}
        >
          📦 Customer Orders
        </button>
      </div>

      {/* BUSINESS PERFORMANCE TAB */}
      {activeTab === "stats" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px", marginBottom: "40px" }}>
            <div style={{ background: "white", padding: "25px", borderRadius: "16px", boxShadow: "0 4px 15px rgba(0,0,0,0.04)", borderLeft: "5px solid #2e7d32" }}>
              <div style={{ fontSize: "14px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Total Sales</div>
              <div style={{ fontSize: "28px", fontWeight: "bold", color: "#2e7d32", marginTop: "10px" }}>₹{totalSales}</div>
            </div>
            <div style={{ background: "white", padding: "25px", borderRadius: "16px", boxShadow: "0 4px 15px rgba(0,0,0,0.04)", borderLeft: "5px solid #8b5e34" }}>
              <div style={{ fontSize: "14px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Total Orders</div>
              <div style={{ fontSize: "28px", fontWeight: "bold", color: "#333", marginTop: "10px" }}>{totalOrdersCount}</div>
            </div>
            <div style={{ background: "white", padding: "25px", borderRadius: "16px", boxShadow: "0 4px 15px rgba(0,0,0,0.04)", borderLeft: "5px solid #ef6c00" }}>
              <div style={{ fontSize: "14px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Pending Shipments</div>
              <div style={{ fontSize: "28px", fontWeight: "bold", color: "#ef6c00", marginTop: "10px" }}>{pendingOrdersCount}</div>
            </div>
            <div style={{ background: "white", padding: "25px", borderRadius: "16px", boxShadow: "0 4px 15px rgba(0,0,0,0.04)", borderLeft: "5px solid #d32f2f" }}>
              <div style={{ fontSize: "14px", color: "#888", fontWeight: "600", textTransform: "uppercase" }}>Low Stock items</div>
              <div style={{ fontSize: "28px", fontWeight: "bold", color: "#d32f2f", marginTop: "10px" }}>{lowStockProductsCount}</div>
            </div>
          </div>

          <div style={{ background: "white", padding: "30px", borderRadius: "16px", boxShadow: "0 4px 15px rgba(0,0,0,0.04)", textAlign: "center" }}>
            <span style={{ fontSize: "40px" }}>🧁</span>
            <h3 style={{ color: "#8b5e34", marginTop: "10px" }}>Welcome to the Control Panel</h3>
            <p style={{ color: "#666", maxWidth: "600px", margin: "10px auto 0 auto", lineHeight: "1.6" }}>
              Here you can monitor sales, check inventory levels, fulfill baking requests, and edit the products visible in the display shelves.
            </p>
          </div>
        </div>
      )}

      {/* PRODUCT INVENTORY TAB */}
      {activeTab === "products" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h2 style={{ color: "#333", margin: 0 }}>All Pastry Products</h2>
            <button
              onClick={handleAddProductClick}
              style={{
                padding: "10px 20px",
                background: "#8b5e34",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: "bold",
                cursor: "pointer",
                boxShadow: "0 4px 6px rgba(139,94,52,0.2)"
              }}
            >
              + Add New Product
            </button>
          </div>

          {loadingProducts ? (
            <div>Loading product list...</div>
          ) : (
            <div style={{ background: "white", borderRadius: "16px", boxShadow: "0 4px 15px rgba(0,0,0,0.04)", overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ background: "#faf7f2", borderBottom: "1px solid #eee" }}>
                    <th style={{ padding: "15px 20px", color: "#666" }}>Preview</th>
                    <th style={{ padding: "15px 20px", color: "#666" }}>Product Name</th>
                    <th style={{ padding: "15px 20px", color: "#666" }}>Category</th>
                    <th style={{ padding: "15px 20px", color: "#666" }}>Price</th>
                    <th style={{ padding: "15px 20px", color: "#666" }}>Stock</th>
                    <th style={{ padding: "15px 20px", color: "#666" }}>Eggless</th>
                    <th style={{ padding: "15px 20px", color: "#666" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((prod) => (
                    <tr key={prod.id} style={{ borderBottom: "1px solid #f5f5f5" }}>
                      <td style={{ padding: "12px 20px" }}>
                        <img src={prod.image} alt={prod.name} style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "8px" }} />
                      </td>
                      <td style={{ padding: "12px 20px", fontWeight: "600", color: "#333" }}>{prod.name}</td>
                      <td style={{ padding: "12px 20px", color: "#666" }}>{prod.category}</td>
                      <td style={{ padding: "12px 20px", fontWeight: "bold", color: "#8b5e34" }}>₹{prod.price}</td>
                      <td style={{ padding: "12px 20px" }}>
                        <span style={{
                          fontWeight: "bold",
                          color: prod.stock <= 0 ? "#c62828" : prod.stock <= 5 ? "#ef6c00" : "#2e7d32"
                        }}>
                          {prod.stock} items
                        </span>
                      </td>
                      <td style={{ padding: "12px 20px" }}>{prod.eggless}</td>
                      <td style={{ padding: "12px 20px" }}>
                        <button
                          onClick={() => handleEditProductClick(prod)}
                          style={{ marginRight: "10px", padding: "6px 12px", background: "#f0f0f0", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProductClick(prod.id)}
                          style={{ padding: "6px 12px", background: "#ffe9e6", color: "#b43b2e", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* CUSTOMER ORDERS TAB */}
      {activeTab === "orders" && (
        <div>
          <h2 style={{ color: "#333", marginBottom: "20px" }}>Customer Orders</h2>

          {loadingOrders ? (
            <div>Loading client orders...</div>
          ) : orders.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", background: "white", borderRadius: "16px" }}>No orders placed yet.</div>
          ) : (
            <div style={{ display: "grid", gap: "20px" }}>
              {orders.map((order) => (
                <div
                  key={order.id}
                  style={{
                    background: "white",
                    padding: "25px",
                    borderRadius: "16px",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.04)",
                    borderLeft: `6px solid ${
                      order.status === "Delivered" ? "#2e7d32" : order.status === "Shipped" ? "#1976d2" : order.status === "Cancelled" ? "#c62828" : "#ef6c00"
                    }`
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", borderBottom: "1px solid #eee", paddingBottom: "12px", marginBottom: "15px" }}>
                    <div>
                      <span style={{ fontSize: "18px", fontWeight: "bold", color: "#333" }}>Order #{order.id}</span>
                      <span style={{ marginLeft: "15px", fontSize: "14px", color: "#888" }}>{new Date(order.createdAt).toLocaleString()}</span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ fontSize: "14px", color: "#666", fontWeight: "500" }}>Status:</span>
                      <select
                        value={order.status}
                        onChange={(e) => handleOrderStatusChange(order.id, e.target.value)}
                        style={{
                          padding: "6px 10px",
                          borderRadius: "6px",
                          border: "1px solid #ccc",
                          background: "white",
                          fontWeight: "600",
                          cursor: "pointer"
                        }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  {/* Order detail split */}
                  <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "25px" }}>
                    {/* Shipping Info */}
                    <div style={{ flex: "1", minWidth: "250px" }}>
                      <h4 style={{ margin: "0 0 8px 0", color: "#8b5e34" }}>Customer details</h4>
                      <div style={{ fontSize: "14px", lineHeight: "1.6", color: "#555" }}>
                        <strong>Name:</strong> {order.fullName}<br />
                        <strong>Phone:</strong> {order.phone}<br />
                        <strong>Shipping Address:</strong><br />
                        {order.address}, {order.city} - {order.pincode}
                      </div>
                    </div>

                    {/* Order Items */}
                    <div style={{ flex: "1.5", minWidth: "300px" }}>
                      <h4 style={{ margin: "0 0 8px 0", color: "#8b5e34" }}>Items Ordered</h4>
                      <div style={{ background: "#fdfdfb", padding: "10px 15px", borderRadius: "10px", border: "1px solid #f1eeeb" }}>
                        {order.items && order.items.map((item, idx) => (
                          <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", padding: "6px 0", borderBottom: idx === order.items.length - 1 ? "none" : "1px dashed #eee" }}>
                            <span>{item.name} <strong>x {item.quantity}</strong></span>
                            <span style={{ fontWeight: "bold" }}>₹{item.price * item.quantity}</span>
                          </div>
                        ))}
                        <div style={{ display: "flex", justifyContent: "space-between", borderTop: "2px solid #ddd", marginTop: "8px", paddingTop: "8px", fontWeight: "bold", fontSize: "16px" }}>
                          <span>Total Paid:</span>
                          <span style={{ color: "#8b5e34" }}>₹{order.totalAmount}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ADD/EDIT PRODUCT MODAL */}
      {showProductModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 3000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backdropFilter: "blur(4px)"
          }}
        >
          <form
            onSubmit={handleProductFormSubmit}
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "16px",
              width: "600px",
              maxWidth: "90%",
              maxHeight: "90vh",
              overflowY: "auto",
              position: "relative"
            }}
          >
            <button
              type="button"
              onClick={() => setShowProductModal(false)}
              style={{
                position: "absolute",
                top: "15px",
                right: "15px",
                background: "none",
                border: "none",
                fontSize: "20px",
                cursor: "pointer",
                color: "#999"
              }}
            >
              ✕
            </button>

            <h3 style={{ margin: "0 0 20px 0", color: "#8b5e34", fontFamily: "'Playfair Display', serif", fontSize: "22px" }}>
              {editingProduct ? `Edit Product: ${editingProduct.name}` : "Add New Pastry"}
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
              <div>
                <label style={{ fontSize: "12px", fontWeight: "bold", color: "#555" }}>Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={productForm.name}
                  onChange={handleProductInputChange}
                  required
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ddd", marginTop: "5px", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: "bold", color: "#555" }}>Category *</label>
                <select
                  name="category"
                  value={productForm.category}
                  onChange={handleProductInputChange}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ddd", marginTop: "5px", boxSizing: "border-box" }}
                >
                  <option value="Cakes">Cakes</option>
                  <option value="Croissants">Croissants</option>
                  <option value="Cookies">Cookies</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: "bold", color: "#555" }}>Price (₹) *</label>
                <input
                  type="number"
                  name="price"
                  value={productForm.price}
                  onChange={handleProductInputChange}
                  required
                  min="0"
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ddd", marginTop: "5px", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: "bold", color: "#555" }}>Stock *</label>
                <input
                  type="number"
                  name="stock"
                  value={productForm.stock}
                  onChange={handleProductInputChange}
                  required
                  min="0"
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ddd", marginTop: "5px", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: "bold", color: "#555" }}>Eggless *</label>
                <select
                  name="eggless"
                  value={productForm.eggless}
                  onChange={handleProductInputChange}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ddd", marginTop: "5px", boxSizing: "border-box" }}
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: "bold", color: "#555" }}>Weight (e.g. 1 kg / 250 g)</label>
                <input
                  type="text"
                  name="weight"
                  placeholder="e.g. 1 kg"
                  value={productForm.weight}
                  onChange={handleProductInputChange}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ddd", marginTop: "5px", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: "bold", color: "#555" }}>Serves (e.g. 8 people)</label>
                <input
                  type="text"
                  name="serves"
                  placeholder="e.g. 8 people"
                  value={productForm.serves}
                  onChange={handleProductInputChange}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ddd", marginTop: "5px", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: "bold", color: "#555" }}>Shelf Life</label>
                <input
                  type="text"
                  name="shelfLife"
                  placeholder="e.g. 3 days"
                  value={productForm.shelfLife}
                  onChange={handleProductInputChange}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ddd", marginTop: "5px", boxSizing: "border-box" }}
                />
              </div>
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label style={{ fontSize: "12px", fontWeight: "bold", color: "#555" }}>Allergens (e.g. Wheat, Dairy)</label>
              <input
                type="text"
                name="allergens"
                placeholder="Wheat, Dairy"
                value={productForm.allergens}
                onChange={handleProductInputChange}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ddd", marginTop: "5px", boxSizing: "border-box" }}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label style={{ fontSize: "12px", fontWeight: "bold", color: "#555" }}>Product Details / Description</label>
              <textarea
                name="details"
                value={productForm.details}
                onChange={handleProductInputChange}
                rows="3"
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ddd", marginTop: "5px", boxSizing: "border-box", resize: "vertical" }}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ fontSize: "12px", fontWeight: "bold", color: "#555", display: "block", marginBottom: "5px" }}>Product Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ fontSize: "14px" }}
              />
              <p style={{ margin: "5px 0 0 0", fontSize: "11px", color: "#777" }}>
                {editingProduct ? "Leave blank to keep current image." : "Select an image to upload."}
              </p>
            </div>

            <div style={{ marginBottom: "25px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "#333", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  name="featured"
                  checked={productForm.featured}
                  onChange={handleProductInputChange}
                  style={{ width: "18px", height: "18px" }}
                />
                Show on Featured Display (Homepage)
              </label>
            </div>

            <div style={{ display: "flex", gap: "15px" }}>
              <button
                type="submit"
                style={{
                  flex: 1,
                  padding: "12px",
                  background: "#8b5e34",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                {editingProduct ? "Save Changes" : "Create Product"}
              </button>
              <button
                type="button"
                onClick={() => setShowProductModal(false)}
                style={{
                  flex: 1,
                  padding: "12px",
                  background: "#f0f0f0",
                  color: "#333",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
