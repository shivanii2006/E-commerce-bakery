import React from "react";
import { Link } from "react-router-dom";
import landingBg from "../assets/landing-bg.jpg";
import cakesImg from "../assets/chocolate-cake.jpg";
import croissantsImg from "../assets/croissant.jpg";
import cookiesImg from "../assets/cookies.jpg";

function LandingPage() {
  return (
    <div>
      {/* Hero Section */}
      <div
        style={{
          backgroundImage: `url(${landingBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          paddingLeft:"60px",
          color: "white",
          textAlign: "left",
        }}
      >
        <h1
          style={{
            fontSize: "3.5rem",
            textShadow: `
              -2px -2px 0 #000,  
              2px -2px 0 #000,  
              -2px 2px 0 #000,  
              2px 2px 0 #000
            `,
          }}
        >
          Welcome to Sweet Treats
        </h1>
      </div>

      {/* Sweet Collection */}
      <section style={{ padding: "40px", textAlign: "center" }}>
        <h2 style={{ marginBottom: "30px", color: "#8b5e34" }}>
          Our Sweet Collection
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "30px",
            justifyItems: "center",
            maxWidth: "1000px",
            margin: "0 auto",
          }}
        >
          {/* Cakes */}
          <Link to="/products" style={{ textDecoration: "none", color: "inherit" }}>
            <div className="hover-card"
              style={{
                borderRadius: "15px",
                overflow: "hidden",
                background: "white",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                cursor: "pointer",
              }}
            >
              <img src={cakesImg} alt="Cakes"
                style={{ width: "300px", height: "200px", objectFit: "cover" }} />
              <h3 style={{ padding: "15px", color: "#333" }}>Cakes</h3>
            </div>
          </Link>

          {/* Croissants */}
          <Link to="/products" style={{ textDecoration: "none", color: "inherit" }}>
            <div className="hover-card"
              style={{
                borderRadius: "15px",
                overflow: "hidden",
                background: "white",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                cursor: "pointer",
              }}
            >
              <img src={croissantsImg} alt="Croissants"
                style={{ width: "300px", height: "200px", objectFit: "cover" }} />
              <h3 style={{ padding: "15px", color: "#333" }}>Croissants</h3>
            </div>
          </Link>

          {/* Cookies */}
          <Link to="/products" style={{ textDecoration: "none", color: "inherit" }}>
            <div className="hover-card"
              style={{
                borderRadius: "15px",
                overflow: "hidden",
                background: "white",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                cursor: "pointer",
              }}
            >
              <img src={cookiesImg} alt="Cookies"
                style={{ width: "300px", height: "200px", objectFit: "cover" }} />
              <h3 style={{ padding: "15px", color: "#333" }}>Cookies</h3>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
