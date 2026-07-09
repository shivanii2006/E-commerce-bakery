import React from "react";

function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#8b5e34", // brownish theme
        color: "white",
        padding: "40px 20px",
        marginTop: "40px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        {/* Visit Our Shop */}
        <div style={{ flex: "1", minWidth: "200px" }}>
          <h3 style={{ marginBottom: "15px" }}>Visit Our Shop</h3>
          <p>Sweet Treats Bakery</p>
          <p>Main Street, Navsari</p>
        </div>

        {/* Contact */}
        <div style={{ flex: "1", minWidth: "200px" }}>
          <h3 style={{ marginBottom: "15px" }}>Contact</h3>
          <p>Email: info@sweettreats.com</p>
          <p>Phone: +91 9876543210</p>
        </div>

        {/* Opening Hours */}
        <div style={{ flex: "1", minWidth: "200px" }}>
          <h3 style={{ marginBottom: "15px" }}>Opening Hours</h3>
          <p>Mon - Fri: 9:00 AM - 8:00 PM</p>
          <p>Sat - Sun: 10:00 AM - 6:00 PM</p>
        </div>
      </div>
      <div style={{ textAlign: "center", marginTop: "30px", fontSize: "0.9rem" }}>
        &copy; 2025 Sweet Treats. All Rights Reserved.
      </div>
    </footer>
  );
}

export default Footer;
