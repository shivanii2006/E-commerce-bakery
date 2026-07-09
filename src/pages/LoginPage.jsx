import React from "react";
import loginBg from "../assets/login-bg.jpg";

function LoginPage() {
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
      }}
    >
      <form
        style={{
          background: "rgba(235, 228, 202, 0.9)",
          padding: "40px",
          borderRadius: "10px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
          width: "350px",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>Login</h2>
        <input
          type="email"
          placeholder="Email"
          required
          style={{ width: "100%", margin: "10px 0", padding: "10px" }}
        />
        <input
          type="password"
          placeholder="Password"
          required
          style={{ width: "100%", margin: "10px 0", padding: "10px" }}
        />
        <button
          type="submit"
          style={{
            marginTop: "15px",
            padding: "10px 20px",
            background: "#895c2cff",
            border: "none",
            borderRadius: "5px",
            color: "white",
            cursor: "pointer",
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
