import { createContext, useState, useContext } from "react";

export const DebateContext = createContext();

export const DebateProvider = ({ children }) => {
  const [debateConfig, setDebateConfig] = useState({
    topic: "",
    argument: "",
    stance: "agree", // "agree" = for, "disagree" = against (kept for existing UI)
    personality: null,
    debateId: null,
    persisted: false,
  });

  const [messages, setMessages] = useState([]);

  const addMessage = (role, content) => {
    setMessages((prev) => [
      ...prev,
      {
        role,        // "user" | "ai"
        content,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  const resetDebate = () => {
    setDebateConfig({ topic: "", argument: "", stance: "agree", personality: null, debateId: null, persisted: false });
    setMessages([]);
  };

  return (
    <DebateContext.Provider
      value={{
        debateConfig,
        setDebateConfig,
        messages,
        setMessages,
        addMessage,
        resetDebate,
      }}
    >
      {children}
    </DebateContext.Provider>
  );
};

// Custom hook for convenience
export const useDebate = () => useContext(DebateContext);

export default DebateProvider;
