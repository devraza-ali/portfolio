import React from "react";
import C from "../../theme";

export function MetricsSection() {
  const stats = [
    { value: "4+", label: "Years in Production" },
    { value: "6+", label: "SaaS Platforms Shipped" },
    { value: "$500K+", label: "GMV Processed" },
    { value: "2,000+", label: "Active Users Served" },
    { value: "100%", label: "On-Time Delivery" },
  ];

  return (
    <div style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, background: `${C.surface}60` }}>
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 24px", display: "flex", flexWrap: "wrap" }}>
        {stats.map((s, i) => (
          <div
            key={i}
            style={{
              flex: "1 1 120px",
              padding: "28px 12px",
              textAlign: "center",
              borderRight: i < stats.length - 1 ? `1px solid ${C.border}` : "none",
            }}
          >
            <div style={{ fontSize: 26, fontWeight: 800, fontFamily: "'JetBrains Mono',monospace", color: C.copper, marginBottom: 6 }}>{s.value}</div>
            <div style={{ fontSize: 11, color: C.secondary, textTransform: "uppercase", letterSpacing: "0.15em", lineHeight: 1.4 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
