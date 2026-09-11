import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { debatesApi } from "../api/client.js";

const History = () => {
  const navigate = useNavigate();
  const [debates, setDebates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    debatesApi.list()
      .then(setDebates)
      .catch((e) => {
        if (e.loginRequired) navigate(`/login?next=${encodeURIComponent("/history")}`);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ textAlign: "center", padding: 60, color: "#6b7280" }}>Loading history...</p>;

  if (debates.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "80px 24px" }}>
        <p style={{ color: "#6b7280", marginBottom: 16 }}>No saved debates yet. They appear here once MongoDB is connected.</p>
        <Link to="/setup" style={{ padding: "10px 24px", background: "#111827", color: "#fff", borderRadius: 6, textDecoration: "none", fontWeight: 600 }}>Start a Debate</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px 80px" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: 20 }}>Debate History</h1>
      {debates.map((d) => (
        <div key={d._id} style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: "14px 18px", marginBottom: 12 }}>
          <div style={{ fontWeight: 700 }}>{d.topic}</div>
          <div style={{ fontSize: "0.8rem", color: "#6b7280", margin: "4px 0 10px" }}>
            vs {d.personalityId} · {d.stance} · {d.status} · {new Date(d.createdAt).toLocaleString()}
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <Link to={`/chat/${d._id}`} style={{ fontSize: "0.85rem", fontWeight: 600 }}>Continue</Link>
            <Link to={`/summary/${d._id}`} style={{ fontSize: "0.85rem", fontWeight: 600 }}>Summary</Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default History;
