import { useRef, useCallback } from "react";

const MicIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="22" />
  </svg>
);

const StopIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="6" y="6" width="12" height="12" rx="2" />
  </svg>
);

export default function VoiceButton({ isListening, onToggle, disabled }) {
  const handleClick = useCallback(
    (e) => {
      e.preventDefault();
      if (disabled) return;
      onToggle?.();
    },
    [disabled, onToggle]
  );

  return (
    <button
      className={`voice-btn ${isListening ? "listening" : ""}`}
      onClick={handleClick}
      disabled={disabled}
      aria-label={isListening ? "Stop recording" : "Start recording"}
      title={disabled ? "Unavailable" : isListening ? "Click to stop" : "Click to speak"}
      type="button"
    >
      {isListening ? <StopIcon /> : <MicIcon />}
      <span className="voice-btn-label">{isListening ? "Stop" : "Speak"}</span>
    </button>
  );
}
