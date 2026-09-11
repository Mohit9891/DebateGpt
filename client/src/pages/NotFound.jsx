import { Link } from "react-router-dom";

const NotFound = () => (
  <div style={{ textAlign: "center", padding: "100px 24px" }}>
    <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: 12 }}>404 — Page not found</h1>
    <p style={{ color: "#6b7280", marginBottom: 24 }}>The page you requested does not exist.</p>
    <Link to="/" style={{ padding: "10px 24px", background: "#111827", color: "#fff", borderRadius: 6, textDecoration: "none", fontWeight: 600 }}>Back to Home</Link>
  </div>
);

export default NotFound;
