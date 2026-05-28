function Navbar() {
  return (
    <header
      style={{
        height: "64px",
        background: "white",
        borderBottom: "1px solid #e5e7eb",
        display: "flex",
        alignItems: "center",
        padding: "0 24px",
        justifyContent: "space-between",
      }}
    >
      <h3>ESG Emissions Dashboard</h3>
      <span>Admin</span>
    </header>
  );
}

export default Navbar;