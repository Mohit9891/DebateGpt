import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { analyticsApi } from "../api/client.js";

const Analytics = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    analyticsApi.get().then(setData).catch((e) => setError(e.message));
  }, []);

  if (error) return <p style={{ textAlign: "center", padding: 60, color: "#ef4444" }}>{error}</p>;
  if (!data) return <p style={{ textAlign: "center", padding: 60, color: "#6b7280" }}>Loading analytics...</p>;

  const cards = [
    { n: data.debates, l: "Total Debates" },
    { n: data.messages, l: "Total Messages" },
    { n: data.ended, l: "Completed" },
    { n: data.avgRating ?? "–", l: "Avg. Rating" },
  ];

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "40px 24px 80px" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 20 }}>Your Analytics</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 12, marginBottom: 24 }}>
        {cards.map((c) => (
          <div key={c.l} style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 8, padding: "16px", textAlign: "center" }}>
            <div style={{ fontSize: "1.6rem", fontWeight: 800 }}>{c.n}</div>
            <div style={{ fontSize: "0.75rem", color: "#9ca3af" }}>{c.l}</div>
          </div>
        ))}
      </div>
      <h2 style={{ fontWeight: 700, marginBottom: 12 }}>By Opponent</h2>
      {(data.byPersonality || []).map((b) => (
        <div key={b._id} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f3f4f6", padding: "8px 0", fontSize: "0.9rem" }}>
          <span style={{ textTransform: "capitalize" }}>{b._id}</span>
          <span style={{ fontWeight: 700 }}>{b.count}</span>
        </div>
      ))}
      {(!data.byPersonality || data.byPersonality.length === 0) && <p style={{ color: "#9ca3af", fontSize: "0.85rem" }}>No debates yet.</p>}
      <h2 style={{ fontWeight: 700, margin: "24px 0 12px" }}>Recent</h2>
      {(data.recent || []).map((d) => (
        <div key={d.id} style={{ fontSize: "0.85rem", padding: "8px 0", borderBottom: "1px solid #f9fafb" }}>
          <Link to={`/summary/${d.id}`}>{d.topic}</Link>
          <span style={{ color: "#9ca3af" }}> · {d.status}</span>
        </div>
      ))}
    </div>
  );
};

export default Analytics;
