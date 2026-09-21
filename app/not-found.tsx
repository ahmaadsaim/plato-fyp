import React from "react";

export default function NotFound() {
  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
        404 - Not Found
      </h1>
      <p style={{ color: "#666" }}>The requested tenant or page could not be found.</p>
    </main>
  );
}
