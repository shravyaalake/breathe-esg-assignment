function StatCard({ title, value, subtitle }) {
  return (
    <div style={{
      background: "white",
      padding: "20px",
      borderRadius: "12px",
      border: "1px solid #e5e7eb",
      boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
    }}>
      <p style={{ margin: 0, color: "#6b7280", fontSize: "14px" }}>{title}</p>
      <h2 style={{ margin: "8px 0", color: "#0f3d2e" }}>{value}</h2>
      {subtitle && <p style={{ margin: 0, color: "#9ca3af", fontSize: "13px" }}>{subtitle}</p>}
    </div>
  );
}

export default StatCard;