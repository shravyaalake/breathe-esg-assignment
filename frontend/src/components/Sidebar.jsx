import { NavLink } from "react-router-dom";

function Sidebar() {
  const linkStyle = ({ isActive }) => ({
    color: "white",
    textDecoration: "none",
    padding: "12px 16px",
    borderRadius: "10px",
    background: isActive
      ? "rgba(255,255,255,0.18)"
      : "transparent",
    fontWeight: isActive ? "600" : "400",
    transition: "0.2s ease",
  });

  return (
    <aside
      style={{
        width: "220px",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        background: "#064e3b",
        color: "white",
        padding: "24px",
      }}
    >
      <h2 style={{ marginBottom: "32px" }}>
        Breathe ESG
      </h2>

      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <NavLink to="/" style={linkStyle}>
          Dashboard
        </NavLink>

        <NavLink
          to="/review"
          style={linkStyle}
        >
          Activity Review
        </NavLink>

        <NavLink
          to="/upload"
          style={linkStyle}
        >
          CSV Upload
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;