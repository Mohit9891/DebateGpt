import { useNavigate } from "react-router-dom";
import { useDebate } from "../context/DebateContext";

const ArgumentSummary = () => {
  const navigate = useNavigate();
  const { debateConfig, messages, resetDebate } = useDebate();
  const { topic, personality, stance } = debateConfig;

  // Split messages into user and AI
  const userMessages = messages.filter((m) => m.role === "user");
  const aiMessages = messages.filter((m) => m.role === "ai");

  const handleSave = () => {
    const content = messages
      .map((m) => `[${m.time}] ${m.role === "user" ? "You" : personality?.name}: ${m.content}`)
      .join("\n\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `debate-${topic?.slice(0, 30) || "summary"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    const text = `I just debated "${topic}" against an AI ${personality?.name} on DebateGpt!`;
    if (navigator.share) {
      navigator.share({ title: "DebateGpt", text });
    } else {
      navigator.clipboard.writeText(text);
      alert("Copied to clipboard!");
    }
  };

  const handleReturnToSetup = () => {
    resetDebate();
    navigate("/setup");
  };

  // Guard
  if (!topic || messages.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "80px 24px" }}>
        <p style={{ color: "#6b7280", marginBottom: "16px" }}>
          No debate to summarize yet.
        </p>
        <button
          onClick={() => navigate("/setup")}
          style={{
            padding: "10px 24px",
            background: "#111827",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Start a Debate
        </button>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@400;500&display=swap');

        .summary-page {
          font-family: 'DM Sans', sans-serif;
          min-height: calc(100vh - 130px);
          background: #fff;
          padding: 40px 24px 80px;
          box-sizing: border-box;
        }

        .summary-inner {
          max-width: 1060px;
          margin: 0 auto;
        }

        /* Topic header */
        .summary-header {
          margin-bottom: 32px;
        }

        .summary-topic-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: #9ca3af;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          margin-bottom: 6px;
        }

        .summary-topic-text {
          font-family: 'Sora', sans-serif;
          font-size: 1.3rem;
          font-weight: 700;
          color: #111827;
        }

        .summary-meta {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 8px;
          flex-wrap: wrap;
        }

        .meta-badge {
          font-size: 0.78rem;
          font-weight: 600;
          padding: 3px 12px;
          border-radius: 20px;
          border: 1px solid #e5e7eb;
          color: #374151;
          background: #f9fafb;
        }

        /* Two-column grid */
        .summary-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-bottom: 40px;
        }

        @media (max-width: 640px) {
          .summary-grid { grid-template-columns: 1fr; }
        }

        .summary-col-title {
          font-family: 'Sora', sans-serif;
          font-size: 1.05rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 16px;
          padding-bottom: 10px;
          border-bottom: 2px solid #111827;
        }

        .summary-col-title.ai-title {
          border-bottom-color: #e5e7eb;
        }

        /* Argument cards */
        .arg-card {
          border: 1.5px solid #e5e7eb;
          border-radius: 8px;
          padding: 16px 18px;
          margin-bottom: 12px;
          transition: border-color 0.15s, box-shadow 0.15s;
          background: #fff;
        }

        .arg-card:hover {
          border-color: #9ca3af;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .arg-card.user-card:first-child {
          border-color: #3b82f6;
        }

        .arg-point {
          font-family: 'Sora', sans-serif;
          font-size: 0.88rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 6px;
        }

        .arg-content {
          font-size: 0.84rem;
          color: #6b7280;
          line-height: 1.6;
        }

        .arg-time {
          font-size: 0.72rem;
          color: #d1d5db;
          margin-top: 8px;
        }

        /* Stats row */
        .stats-row {
          display: flex;
          gap: 16px;
          margin-bottom: 36px;
          flex-wrap: wrap;
        }

        .stat-box {
          flex: 1;
          min-width: 120px;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 14px 18px;
          text-align: center;
        }

        .stat-num {
          font-family: 'Sora', sans-serif;
          font-size: 1.6rem;
          font-weight: 800;
          color: #111827;
        }

        .stat-label {
          font-size: 0.75rem;
          color: #9ca3af;
          margin-top: 2px;
        }

        /* Action buttons */
        .action-row {
          display: flex;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .action-btn {
          padding: 11px 28px;
          background: #111827;
          color: #fff;
          border: none;
          border-radius: 6px;
          font-family: 'Sora', sans-serif;
          font-weight: 700;
          font-size: 0.875rem;
          cursor: pointer;
          transition: background 0.15s, transform 0.12s;
        }

        .action-btn:hover {
          background: #1d4ed8;
          transform: translateY(-1px);
        }

        .action-btn.outline {
          background: #fff;
          color: #111827;
          border: 1.5px solid #111827;
        }

        .action-btn.outline:hover {
          background: #f3f4f6;
          transform: translateY(-1px);
        }
      `}</style>

      <div className="summary-page">
        <div className="summary-inner">

          {/* Header */}
          <div className="summary-header">
            <div className="summary-topic-label">Debate Summary</div>
            <div className="summary-topic-text">{topic}</div>
            <div className="summary-meta">
              <span className="meta-badge">{personality?.emoji} vs {personality?.name}</span>
              <span
                className="meta-badge"
                style={{
                  background: stance === "agree" ? "#dcfce7" : "#fee2e2",
                  color: stance === "agree" ? "#166534" : "#991b1b",
                  borderColor: stance === "agree" ? "#bbf7d0" : "#fecaca",
                }}
              >
                Your stance: {stance === "agree" ? "In Favor" : "Against"}
              </span>
              <span className="meta-badge">{messages.length} exchanges</span>
            </div>
          </div>

          {/* Stats */}
          <div className="stats-row">
            <div className="stat-box">
              <div className="stat-num">{userMessages.length}</div>
              <div className="stat-label">Your Arguments</div>
            </div>
            <div className="stat-box">
              <div className="stat-num">{aiMessages.length}</div>
              <div className="stat-label">AI Responses</div>
            </div>
            <div className="stat-box">
              <div className="stat-num">{messages.length}</div>
              <div className="stat-label">Total Exchanges</div>
            </div>
            <div className="stat-box">
              <div className="stat-num">
                {Math.max(1, Math.round(messages.reduce((a, m) => a + m.content.split(" ").length, 0) / 100 * 0.5))}m
              </div>
              <div className="stat-label">Est. Read Time</div>
            </div>
          </div>

          {/* Two-column argument summary */}
          <div className="summary-grid">

            {/* User arguments */}
            <div>
              <div className="summary-col-title">User's Arguments</div>
              {userMessages.map((msg, i) => (
                <div key={i} className={`arg-card user-card`}>
                  <div className="arg-point">Point {i + 1}: {summarizePoint(msg.content)}</div>
                  <div className="arg-content">{msg.content}</div>
                  <div className="arg-time">{msg.time}</div>
                </div>
              ))}
            </div>

            {/* AI arguments */}
            <div>
              <div className="summary-col-title ai-title">{personality?.name}'s Arguments</div>
              {aiMessages.map((msg, i) => (
                <div key={i} className="arg-card">
                  <div className="arg-point">Point {i + 1}: {summarizePoint(msg.content)}</div>
                  <div className="arg-content">{msg.content}</div>
                  <div className="arg-time">{msg.time}</div>
                </div>
              ))}
            </div>

          </div>

          {/* Action buttons */}
          <div className="action-row">
            <button className="action-btn" onClick={handleSave}>Save Debate</button>
            <button className="action-btn outline" onClick={handleShare}>Share Debate</button>
            <button className="action-btn" onClick={handleReturnToSetup}>Return to Debate Setup</button>
          </div>

        </div>
      </div>
    </>
  );
};

// Helper: extract a short title from the first few words
function summarizePoint(text) {
  const words = text.trim().split(" ");
  const snippet = words.slice(0, 5).join(" ");
  return snippet.length < text.length ? snippet + "..." : snippet;
}

export default ArgumentSummary;
