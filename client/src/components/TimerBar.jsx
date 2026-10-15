import { useState, useEffect, useRef } from "react";

export default function TimerBar({ duration, isRunning, onTimeUp, onTick }) {
  const [remaining, setRemaining] = useState(duration);
  const intervalRef = useRef(null);

  useEffect(() => {
    setRemaining(duration);
  }, [duration]);

  useEffect(() => {
    if (!isRunning || duration <= 0) {
      clearInterval(intervalRef.current);
      return;
    }
    setRemaining(duration);
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        const next = prev - 1;
        onTick?.(next);
        if (next <= 0) {
          clearInterval(intervalRef.current);
          onTimeUp?.();
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [isRunning, duration, onTimeUp, onTick]);

  if (duration <= 0) return null;

  const pct = Math.max(0, (remaining / duration) * 100);
  const color = pct > 50 ? "#16a34a" : pct > 20 ? "#ca8a04" : "#dc2626";

  return (
    <div className="timer-bar-wrap">
      <div className="timer-bar-track">
        <div className="timer-bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="timer-bar-text" style={{ color }}>
        {remaining}s
      </span>
    </div>
  );
}
