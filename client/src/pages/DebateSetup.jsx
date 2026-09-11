import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { DebateContext } from "../context/DebateContext.jsx";
import { PERSONALITIES } from "../constants/personalities.js";
import { debatesApi } from "../api/client.js";

const DebateSetup = () => {
  const navigate = useNavigate();
  const { setDebateConfig } = useContext(DebateContext);

  const [topic, setTopic] = useState("");
  const [argument, setArgument] = useState("");
  const [stance, setStance] = useState("agree");
  const [selectedPersonality, setSelectedPersonality] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!topic.trim() || topic.trim().length < 5) newErrors.topic = "Please enter a debate topic (min 5 chars).";
    if (!argument.trim() || argument.trim().length < 10) newErrors.argument = "Please enter your argument (min 10 chars).";
    if (!selectedPersonality) newErrors.personality = "Please select a debate personality.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate() || submitting) return;
    const personality = PERSONALITIES.find((p) => p.id === selectedPersonality);
    const stanceForBackend = stance === "agree" ? "for" : "against";
    setSubmitting(true);
    try {
      // Full-stack: persist + get first AI reply from server (server owns prompts)
      const data = await debatesApi.create({
        topic: topic.trim(),
        openingArgument: argument.trim(),
        stance: stanceForBackend,
        personalityId: personality.id,
      });
      setDebateConfig({
        topic: topic.trim(),
        argument: argument.trim(),
        stance,
        personality,
        debateId: data.debateId || null,
        persisted: Boolean(data.persisted && data.debateId),
        initialReply: data.reply || null,
      });
      navigate(data.debateId ? `/chat/${data.debateId}` : "/chat");
    } catch (err) {
      // Fallback to local-only mode so UI never blocks without DB
      setDebateConfig({ topic: topic.trim(), argument: argument.trim(), stance, personality, debateId: null, persisted: false });
      navigate("/chat");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:ital,wght@0,400;0,500;1,400&display=swap');

        .setup-page {
          font-family: 'DM Sans', sans-serif;
          min-height: calc(100vh - 130px);
          background: #ffffff;
          padding: 60px 24px 80px;
        }

        .setup-inner {
          max-width: 640px;
          margin: 0 auto;
        }

        .setup-title {
          font-family: 'Sora', sans-serif;
          font-size: 1.85rem;
          font-weight: 700;
          color: #111827;
          text-align: center;
          margin-bottom: 10px;
        }

        .setup-subtitle {
          text-align: center;
          color: #6b7280;
          font-size: 0.95rem;
          line-height: 1.6;
          margin-bottom: 40px;
        }

        .form-group {
          margin-bottom: 24px;
        }

        .form-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 8px;
        }

        .form-input {
          width: 100%;
          padding: 10px 14px;
          border: 1.5px solid #d1d5db;
          border-radius: 6px;
          font-size: 0.95rem;
          font-family: 'DM Sans', sans-serif;
          color: #111827;
          background: #fff;
          transition: border-color 0.15s;
          box-sizing: border-box;
          outline: none;
        }

        .form-input:focus {
          border-color: #111827;
        }

        .form-input.error {
          border-color: #ef4444;
        }

        .form-textarea {
          resize: vertical;
          min-height: 110px;
        }

        .error-msg {
          font-size: 0.78rem;
          color: #ef4444;
          margin-top: 5px;
        }

        /* Stance */
        .stance-group {
          display: flex;
          gap: 12px;
        }

        .stance-option {
          display: flex;
          align-items: center;
          gap: 7px;
          cursor: pointer;
          font-size: 0.9rem;
          color: #374151;
          padding: 8px 18px;
          border: 1.5px solid #d1d5db;
          border-radius: 6px;
          transition: border-color 0.15s, background 0.15s;
          user-select: none;
        }

        .stance-option.active {
          border-color: #111827;
          background: #f9fafb;
          font-weight: 600;
        }

        .stance-option input {
          accent-color: #111827;
        }

        /* Personality grid */
        .personality-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 12px;
          margin-top: 4px;
        }

        .personality-card {
          border: 1.5px solid #e5e7eb;
          border-radius: 8px;
          padding: 14px 16px;
          cursor: pointer;
          transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
          background: #fff;
        }

        .personality-card:hover {
          border-color: #9ca3af;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }

        .personality-card.selected {
          border-color: #111827;
          background: #f9fafb;
          box-shadow: 0 2px 10px rgba(0,0,0,0.08);
        }

        .personality-card.error-border {
          border-color: #ef4444;
        }

        .p-emoji {
          font-size: 1.5rem;
          margin-bottom: 8px;
          display: block;
        }

        .p-name {
          font-family: 'Sora', sans-serif;
          font-size: 0.88rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 4px;
        }

        .p-desc {
          font-size: 0.78rem;
          color: #6b7280;
          line-height: 1.4;
        }

        .p-check {
          display: inline-block;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #111827;
          float: right;
          margin-top: -22px;
          position: relative;
        }

        /* Submit button */
        .submit-btn {
          width: 100%;
          padding: 13px;
          background: #111827;
          color: #fff;
          font-family: 'Sora', sans-serif;
          font-weight: 700;
          font-size: 0.95rem;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          margin-top: 8px;
          transition: background 0.15s, transform 0.12s;
          letter-spacing: 0.01em;
        }

        .submit-btn:hover {
          background: #1d4ed8;
          transform: translateY(-1px);
        }

        .submit-btn:active {
          transform: translateY(0);
        }

        .divider {
          border: none;
          border-top: 1px solid #f3f4f6;
          margin: 32px 0;
        }
      `}</style>

      <div className="setup-page">
        <div className="setup-inner">

          {/* Header */}
          <h1 className="setup-title">Setup Your Debate</h1>
          <p className="setup-subtitle">
            Enter the debate topic, your argument, select your stance,
            and choose an AI personality to debate against.
          </p>

          {/* Debate Topic */}
          <div className="form-group">
            <label className="form-label">Debate Topic</label>
            <input
              type="text"
              className={`form-input ${errors.topic ? "error" : ""}`}
              placeholder="Enter the topic of debate"
              value={topic}
              onChange={(e) => {
                setTopic(e.target.value);
                if (errors.topic) setErrors((p) => ({ ...p, topic: null }));
              }}
            />
            {errors.topic && <p className="error-msg">{errors.topic}</p>}
          </div>

          {/* Your Argument */}
          <div className="form-group">
            <label className="form-label">Your Argument</label>
            <textarea
              className={`form-input form-textarea ${errors.argument ? "error" : ""}`}
              placeholder="Enter your opening argument here..."
              value={argument}
              onChange={(e) => {
                setArgument(e.target.value);
                if (errors.argument) setErrors((p) => ({ ...p, argument: null }));
              }}
            />
            {errors.argument && <p className="error-msg">{errors.argument}</p>}
          </div>

          {/* Stance */}
          <div className="form-group">
            <label className="form-label">Your Stance</label>
            <div className="stance-group">
              {["agree", "disagree"].map((s) => (
                <label
                  key={s}
                  className={`stance-option ${stance === s ? "active" : ""}`}
                >
                  <input
                    type="radio"
                    name="stance"
                    value={s}
                    checked={stance === s}
                    onChange={() => setStance(s)}
                  />
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </label>
              ))}
            </div>
          </div>

          <hr className="divider" />

          {/* Personality Selection */}
          <div className="form-group">
            <label className="form-label">Choose Your Opponent</label>
            <p style={{ fontSize: "0.83rem", color: "#9ca3af", marginBottom: "14px", marginTop: "-4px" }}>
              Select the AI personality you want to debate against
            </p>
            <div className="personality-grid">
              {PERSONALITIES.map((p) => (
                <div
                  key={p.id}
                  className={`personality-card ${selectedPersonality === p.id ? "selected" : ""} ${errors.personality && !selectedPersonality ? "error-border" : ""}`}
                  onClick={() => {
                    setSelectedPersonality(p.id);
                    if (errors.personality) setErrors((prev) => ({ ...prev, personality: null }));
                  }}
                >
                  <span className="p-emoji">{p.emoji}</span>
                  {selectedPersonality === p.id && (
                    <span className="p-check">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ display: "block" }}>
                        <circle cx="8" cy="8" r="8" fill="#111827" />
                        <path d="M4.5 8l2.5 2.5 4.5-4.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  )}
                  <div className="p-name">{p.name}</div>
                  <div className="p-desc">{p.description}</div>
                </div>
              ))}
            </div>
            {errors.personality && <p className="error-msg">{errors.personality}</p>}
          </div>

          {/* Submit */}
          <button className="submit-btn" onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Starting..." : "Start Debate"}
          </button>

        </div>
      </div>
    </>
  );
};

export default DebateSetup;
