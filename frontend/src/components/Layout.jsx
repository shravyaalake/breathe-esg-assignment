import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function Layout({ children }) {
  return (
    <div>
      <Sidebar />
      <main style={{ marginLeft: "220px", minHeight: "100vh", background: "#f5f7f6" }}>
        <Navbar />
        <div style={{ padding: "24px" }}>{children}</div>
      </main>
    </div>
  );
}

export default Layout;