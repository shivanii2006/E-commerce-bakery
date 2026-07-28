import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { STATIC_PRODUCTS, getResolvedImage } from "../pages/ProductsPage";

export default function SearchBar({ setSearchQuery }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [hits, setHits] = useState([]);
  const blurTimer = useRef(null);

  const onChange = async (e) => {
    const v = e.target.value;
    setQ(v);
    if (setSearchQuery) {
      setSearchQuery(v.toLowerCase());
    }

    if (!v.trim()) {
      setHits([]);
      setOpen(false);
      return;
    }

    try {
      const res = await fetch(`/api/products?search=${encodeURIComponent(v)}`);
      if (res.ok) {
        const data = await res.json();
        const mapped = data.map(item => ({
          ...item,
          image: getResolvedImage(item.image, item.slug)
        }));
        setHits(mapped);
        setOpen(mapped.length > 0);
      } else {
        // Fallback to static catalog search
        const filtered = STATIC_PRODUCTS.filter(
          (p) =>
            p.name.toLowerCase().includes(v.toLowerCase()) ||
            p.category.toLowerCase().includes(v.toLowerCase())
        );
        setHits(filtered);
        setOpen(filtered.length > 0);
      }
    } catch (error) {
      // Fallback to static catalog search
      const filtered = STATIC_PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(v.toLowerCase()) ||
          p.category.toLowerCase().includes(v.toLowerCase())
      );
      setHits(filtered);
      setOpen(filtered.length > 0);
    }
  };

  const onFocus = () => {
    if (q.trim() && hits.length) setOpen(true);
  };

  const onBlur = () => {
    blurTimer.current = setTimeout(() => setOpen(false), 150);
  };

  return (
    <div style={{ position: "relative", width: 280 }}>
      {/* Input wrapper */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          border: "1px solid #fff",
          borderRadius: 999,
          padding: "8px 14px",
          background: "rgba(255, 255, 255, 0.1)",
        }}
      >
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
          placeholder="Search cakes, cookies..."
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            color: "white",
            fontSize: 14,
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
          onMouseDown={(e) => e.preventDefault()}
        >
          {hits.map((item) => (
            <Link
              key={item.id || item.slug}
              to={`/product/${item.slug}`}
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
              <div style={{ textAlign: "left" }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{item.name}</div>
                <div style={{ fontSize: 11, color: "#666" }}>{item.category} • ₹{item.price}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
