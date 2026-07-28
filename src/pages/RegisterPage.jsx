import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import loginBg from "../assets/login-bg.jpg";

function RegisterPage({ onLoginSuccess }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        // Save token and user details to localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        
        if (onLoginSuccess) {
          onLoginSuccess(data.user);
        }

        // Redirect to homepage
        navigate("/");
      } else {
        setError(data.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Registration request failed:", err);
      setError("Server connection failed. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${loginBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "calc(100vh - 120px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: "rgba(255, 255, 255, 0.95)",
          padding: "40px",
          borderRadius: "16px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
          width: "100%",
          maxWidth: "380px",
          textAlign: "center",
          backdropFilter: "blur(5px)",
        }}
      >
        <h2 style={{ marginBottom: "10px", color: "#8b5e34", fontFamily: "'Playfair Display', serif" }}>
          Create Account
        </h2>
        <p style={{ color: "#666", fontSize: "14px", marginBottom: "25px" }}>
          Register to order your favorite treats!
        </p>

        {error && (
          <div
            style={{
              padding: "10px 15px",
              background: "#ffebee",
              color: "#c62828",
              borderRadius: "8px",
              fontSize: "14px",
              marginBottom: "20px",
              textAlign: "left",
              borderLeft: "4px solid #e53935",
            }}
          >
            {error}
          </div>
        )}

        <div style={{ marginBottom: "15px", textAlign: "left" }}>
          <label style={{ fontSize: "13px", fontWeight: "600", color: "#555" }}>Full Name</label>
          <input
            type="text"
            placeholder="John Doe"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: "100%",
              margin: "5px 0 0 0",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              boxSizing: "border-box",
              fontSize: "15px",
              outline: "none",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px", textAlign: "left" }}>
          <label style={{ fontSize: "13px", fontWeight: "600", color: "#555" }}>Email Address</label>
          <input
            type="email"
            placeholder="name@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              margin: "5px 0 0 0",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              boxSizing: "border-box",
              fontSize: "15px",
              outline: "none",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px", textAlign: "left" }}>
          <label style={{ fontSize: "13px", fontWeight: "600", color: "#555" }}>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              margin: "5px 0 0 0",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              boxSizing: "border-box",
              fontSize: "15px",
              outline: "none",
            }}
          />
        </div>

        <div style={{ marginBottom: "20px", textAlign: "left" }}>
          <label style={{ fontSize: "13px", fontWeight: "600", color: "#555" }}>Confirm Password</label>
          <input
            type="password"
            placeholder="••••••••"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{
              width: "100%",
              margin: "5px 0 0 0",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              boxSizing: "border-box",
              fontSize: "15px",
              outline: "none",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            background: "#8b5e34",
            border: "none",
            borderRadius: "8px",
            color: "white",
            fontWeight: "bold",
            fontSize: "16px",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "background-color 0.2s",
            boxShadow: "0 4px 6px rgba(139, 94, 52, 0.2)",
          }}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p style={{ marginTop: "20px", fontSize: "14px", color: "#555" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#8b5e34", fontWeight: "bold", textDecoration: "none" }}>
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;
