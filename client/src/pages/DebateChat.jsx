import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDebate } from "../context/DebateContext";

const PERSONALITY_PROMPTS = {
  lawyer: `You are a sharp courtroom lawyer debating the user. Use simple, clear legal reasoning. Be direct and aggressive but easy to understand. No fancy words. Hit hard, hit fast.`,
  
  doctor: `You are a confident doctor debating the user. Use simple health facts and evidence. Speak plainly — like explaining to a patient, not a colleague. Short and direct.`,
  
  scientist: `You are a no-nonsense scientist debating the user. Use real facts and data but explain them simply. No jargon. Keep it sharp and easy to follow.`,
  
  philosopher: `You are a sharp philosopher debating the user. Ask tough questions. Challenge assumptions. Use everyday language — think less Aristotle, more street-smart thinker.`,
  
  economist: `You are a straight-talking economist debating the user. Use simple logic, numbers, and real-world examples. No textbook language. Keep it punchy.`,
  
  journalist: `You are a bold investigative journalist debating the user. Ask sharp questions. Demand proof. Speak like you're live on air — clear, fast, confident.`,
};

const DebateChat = () => {
  const navigate = useNavigate();
  const { debateConfig, messages, addMessage } = useDebate();
  const { topic, argument, stance, personality } = debateConfig;

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const hasStarted = useRef(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Auto scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Send opening argument automatically on first load
  useEffect(() => {
    if (!hasStarted.current && topic && argument && personality) {
      hasStarted.current = true;
      addMessage("user", argument);
      sendToAI(argument, []);
    }
  }, []);

  const buildSystemPrompt = () => {
    const personalityPrompt =
      PERSONALITY_PROMPTS[personality?.id] ||
      `You are an intelligent debater opposing the user's argument.`;

    return `${personalityPrompt}

The debate topic is: "${topic}"
The user's stance is: ${stance === "agree" ? "IN FAVOR of" : "AGAINST"} the topic.
You must take the OPPOSITE stance — argue ${stance === "agree" ? "AGAINST" : "IN FAVOR of"} "${topic}".
Stay in character throughout. Do not break the fourth wall.

STRICT RULES:
- Max 3 sentences per response
- Use simple everyday English only
- No long paragraphs — be crisp and punchy
- One strong argument per reply, not five weak ones
- End with a sharp question or challenge to the user`;
  };

  const sendToAI = async (userMessage, existingMessages) => {
    setIsLoading(true);
    try {
      const history = existingMessages.map((m) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.content,
      }));

      history.push({ role: "user", content: userMessage });

      // 🛰️ DYNAMIC URL CONFIGURATION
      // Reads from Vercel's environment variables in production, or uses localhost for local dev.
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

      const response = await fetch(`${API_BASE_URL}/api/debate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history,
          system: buildSystemPrompt(),
        }),
      });

      const data = await response.json();
      const aiText = data?.reply || "I couldn't generate a response. Please try again.";
      addMessage("ai", aiText);
    } catch (err) {
      addMessage("ai", "Something went wrong. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    addMessage("user", trimmed);
    setInput("");
    sendToAI(trimmed, messages);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Guard: redirect if no config
  if (!topic || !personality) {
    return (
      <div style={{ textAlign: "center", padding: "80px 24px" }}>
        <p style={{ color: "#6b7280", marginBottom: "16px" }}>
          No debate configured. Please set up a debate first.
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
          Go to Setup
        </button>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=DM+Sans:wght@400;500&display=swap');

        .chat-page {
          font-family: 'DM Sans', sans-serif;
          min-height: calc(100vh - 130px);
          background: #f3f4f6;
          padding: 24px 20px;
          box-sizing: border-box;
        }

        .topic-bar {
          max-width: 1100px;
          margin: 0 auto 12px;
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }

        .topic-bar-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .topic-label {
          font-size: 0.72rem;
          font-weight: 700;
          color: #9ca3af;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .topic-text {
          font-family: 'Sora', sans-serif;
          font-size: 0.92rem;
          font-weight: 600;
          color: #111827;
        }

        .personality-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 20px;
          padding: 4px 12px;
          font-size: 0.8rem;
          font-weight: 600;
          color: #374151;
        }

        .stance-badge {
          font-size: 0.75rem;
          padding: 3px 10px;
          border-radius: 20px;
          font-weight: 600;
        }

        .end-btn {
          padding: 7px 16px;
          background: #111827;
          color: #fff;
          border: none;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: background 0.15s;
        }
        .end-btn:hover { background: #dc2626; }

        .chat-layout {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 280px;
          gap: 16px;
          align-items: start;
        }

        @media (max-width: 768px) {
          .chat-layout { grid-template-columns: 1fr; }
        }

        /* Chat panel */
        .chat-panel {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .messages-area {
          padding: 20px;
          min-height: 400px;
          max-height: 500px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .messages-area::-webkit-scrollbar { width: 4px; }
        .messages-area::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 4px; }

        .msg-row {
          display: flex;
          flex-direction: column;
          max-width: 72%;
        }
        .msg-row.user { align-self: flex-end; align-items: flex-end; }
        .msg-row.ai   { align-self: flex-start; align-items: flex-start; }

        .msg-meta {
          font-size: 0.72rem;
          color: #9ca3af;
          margin-bottom: 4px;
          padding: 0 2px;
        }

        .msg-bubble {
          padding: 10px 14px;
          border-radius: 8px;
          font-size: 0.9rem;
          line-height: 1.65;
          color: #111827;
        }

        .msg-row.user .msg-bubble {
          background: #dbeafe;
          border-bottom-right-radius: 2px;
        }
        .msg-row.ai .msg-bubble {
          background: #fef9c3;
          border-bottom-left-radius: 2px;
        }

        /* Typing indicator */
        .typing-wrap {
          align-self: flex-start;
        }
        .typing-bubble {
          background: #fef9c3;
          border-radius: 8px;
          border-bottom-left-radius: 2px;
          padding: 12px 16px;
          display: flex;
          gap: 5px;
          align-items: center;
        }
        .typing-dot {
          width: 7px; height: 7px;
          background: #a16207;
          border-radius: 50%;
          animation: bounce 1.2s infinite ease-in-out;
        }
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
          30% { transform: translateY(-5px); opacity: 1; }
        }

        /* Input area */
        .input-area {
          border-top: 1px solid #f3f4f6;
          padding: 12px 16px;
          display: flex;
          gap: 10px;
          align-items: flex-end;
        }

        .chat-input {
          flex: 1;
          border: 1.5px solid #e5e7eb;
          border-radius: 6px;
          padding: 10px 14px;
          font-size: 0.9rem;
          font-family: 'DM Sans', sans-serif;
          color: #111827;
          outline: none;
          resize: none;
          min-height: 42px;
          max-height: 100px;
          transition: border-color 0.15s;
          line-height: 1.5;
        }
        .chat-input:focus { border-color: #111827; }
        .chat-input::placeholder { color: #9ca3af; }

        .send-btn {
          padding: 0 20px;
          height: 42px;
          background: #111827;
          color: #fff;
          border: none;
          border-radius: 6px;
          font-family: 'Sora', sans-serif;
          font-weight: 700;
          font-size: 0.875rem;
          cursor: pointer;
          transition: background 0.15s;
          white-space: nowrap;
        }
        .send-btn:hover:not(:disabled) { background: #1d4ed8; }
        .send-btn:disabled { background: #d1d5db; cursor: not-allowed; }

        /* History panel */
        .history-panel {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 18px;
        }

        .history-title {
          font-family: 'Sora', sans-serif;
          font-size: 0.9rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 14px;
          padding-bottom: 10px;
          border-bottom: 1px solid #f3f4f6;
        }

        .history-list {
          display: flex;
          flex-direction: column;
          gap: 0;
          max-height: 480px;
          overflow-y: auto;
        }
        .history-list::-webkit-scrollbar { width: 3px; }
        .history-list::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 4px; }

        .history-item {
          font-size: 0.78rem;
          color: #4b5563;
          line-height: 1.5;
          padding: 8px 0;
          border-bottom: 1px solid #f9fafb;
        }
        .history-item:last-child { border-bottom: none; }

        .h-time { color: #9ca3af; font-size: 0.7rem; }
        .h-user { font-weight: 700; color: #1d4ed8; }
        .h-ai   { font-weight: 700; color: #92400e; }
        .h-text { margin-top: 2px; color: #6b7280; }
      `}</style>

      <div className="chat-page">

        {/* Topic bar */}
        <div className="topic-bar">
          <div className="topic-bar-left">
            <span className="topic-label">Topic</span>
            <span className="topic-text">{topic}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <div className="personality-badge">
              <span>{personality.emoji}</span>
              <span>vs {personality.name}</span>
            </div>
            <span
              className="stance-badge"
              style={{
                background: stance === "agree" ? "#dcfce7" : "#fee2e2",
                color: stance === "agree" ? "#166534" : "#991b1b",
              }}
            >
              {stance === "agree" ? "In Favor" : "Against"}
            </span>
            <button className="end-btn" onClick={() => navigate("/summary")}>
              End Debate
            </button>
          </div>
        </div>

        {/* Layout */}
        <div className="chat-layout">

          {/* Chat panel */}
          <div className="chat-panel">
            <div className="messages-area">

              {messages.length === 0 && !isLoading && (
                <p style={{ color: "#d1d5db", fontSize: "0.85rem", textAlign: "center", marginTop: "60px" }}>
                  Starting debate...
                </p>
              )}

              {messages.map((msg, i) => (
                <div key={i} className={`msg-row ${msg.role}`}>
                  <div className="msg-meta">
                    {msg.time} · {msg.role === "user" ? "You" : personality.name}
                  </div>
                  <div className="msg-bubble">{msg.content}</div>
                </div>
              ))}

              {isLoading && (
                <div className="typing-wrap">
                  <div style={{ fontSize: "0.72rem", color: "#9ca3af", marginBottom: "4px" }}>
                    {personality.name} is responding...
                  </div>
                  <div className="typing-bubble">
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="input-area">
              <textarea
                ref={inputRef}
                className="chat-input"
                placeholder="Type your follow-up argument or comment..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
              />
              <button
                className="send-btn"
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
              >
                Send
              </button>
            </div>
          </div>

          {/* History panel */}
          <div className="history-panel">
            <div className="history-title">Conversation History</div>
            <div className="history-list">
              {messages.length === 0 ? (
                <p style={{ color: "#d1d5db", fontSize: "0.8rem", textAlign: "center", padding: "20px 0" }}>
                  No messages yet
                </p>
              ) : (
                messages.map((msg, i) => (
                  <div key={i} className="history-item">
                    <div>
                      <span className="h-time">{msg.time} – </span>
                      <span className={msg.role === "user" ? "h-user" : "h-ai"}>
                        {msg.role === "user" ? "You" : personality.name}:
                      </span>
                    </div>
                    <div className="h-text">
                      {msg.content.length > 75
                        ? msg.content.slice(0, 75) + "…"
                        : msg.content}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default DebateChat;