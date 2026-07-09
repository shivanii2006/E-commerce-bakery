// src/components/SearchBar.jsx
import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { products as allProducts } from "../pages/ProductsPage";

function slugify(name) {
  return name.toLowerCase().replace(/\s+/g, "-");
}

export default function SearchBar() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [hits, setHits] = useState([]);
  const blurTimer = useRef(null);

  const onChange = (e) => {
    const v = e.target.value;
    setQ(v);

    if (!v.trim()) {
      setHits([]);
      setOpen(false);
      return;
    }

    const filtered = allProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(v.toLowerCase()) ||
        p.category.toLowerCase().includes(v.toLowerCase())
    );
    setHits(filtered);
    setOpen(filtered.length > 0);
  };

  const onFocus = () => {
    if (q.trim() && hits.length) setOpen(true);
  };

  const onBlur = () => {
    // Delay so a click on a suggestion still registers
    blurTimer.current = setTimeout(() => setOpen(false), 120);
  };

  return (
    <div style={{ position: "relative", width: 320 }}>
      {/* Input wrapper: transparent, white border, oval */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          border: "1px solid #fff",
          borderRadius: 999,
          padding: "8px 14px",
          background: "transparent",
        }}
      >
        {/* Magnifying glass (inline SVG so no extra deps) */}
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          style={{ flexShrink: 0 }}
        >
          <path
            d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>

        <input
          type="text"
          value={q}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder="Search for anything"
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            color: "white",         // input text is white
            fontSize: 14,
            // placeholder remains grey (you said that's fine)
          }}
        />
      </div>

      {/* Suggestions dropdown */}
      {open && hits.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: 0,
            right: 0,
            background: "white",
            borderRadius: 12,
            boxShadow: "0 10px 24px rgba(0,0,0,0.15)",
            overflow: "hidden",
            zIndex: 9999,
          }}
          onMouseDown={(e) => e.preventDefault()} // keep focus until click handled
        >
          {hits.map((item) => (
            <Link
              key={item.name}
              to={`/product/${slugify(item.name)}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                textDecoration: "none",
                color: "#222",
                borderBottom: "1px solid #eee",
              }}
              onClick={() => {
                clearTimeout(blurTimer.current);
                setOpen(false);
                setQ("");
              }}
            >
              <img
                src={item.image}
                alt={item.name}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  objectFit: "cover",
                  flexShrink: 0,
                }}
              />
              <div>
                <div style={{ fontWeight: 600 }}>{item.name}</div>
                <div style={{ fontSize: 12, color: "#666" }}>{item.category}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
