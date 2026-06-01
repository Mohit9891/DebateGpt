import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";

const Home = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  // Animated particle/network background on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let W = (canvas.width = canvas.offsetWidth);
    let H = (canvas.height = canvas.offsetHeight);

    const nodes = Array.from({ length: 38 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 3 + 1.5,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
      });
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0,180,255,${0.18 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }
      nodes.forEach((n) => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,200,255,0.55)";
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    const onResize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@400;500&display=swap');

        .home-root {
          font-family: 'DM Sans', sans-serif;
          min-height: calc(100vh - 120px);
          background: #f7f9fc;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          padding: 60px 24px;
          text-align: center;
        }

        .home-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
        }

        /* Silhouette SVG illustration */
        .silhouette-wrap {
          position: relative;
          z-index: 1;
          width: min(340px, 80vw);
          margin-bottom: 36px;
          filter: drop-shadow(0 8px 32px rgba(0,140,255,0.13));
          animation: floatUp 0.9s cubic-bezier(.22,1,.36,1) both;
        }

        .home-title {
          font-family: 'Sora', sans-serif;
          font-size: clamp(1.9rem, 5vw, 3rem);
          font-weight: 800;
          color: #111827;
          line-height: 1.18;
          margin: 0 0 16px;
          position: relative;
          z-index: 1;
          animation: floatUp 0.9s 0.1s cubic-bezier(.22,1,.36,1) both;
        }

        .home-desc {
          font-size: 1.05rem;
          color: #4b5563;
          max-width: 500px;
          line-height: 1.7;
          margin: 0 auto 32px;
          position: relative;
          z-index: 1;
          animation: floatUp 0.9s 0.2s cubic-bezier(.22,1,.36,1) both;
        }

        .home-btn {
          position: relative;
          z-index: 1;
          display: inline-block;
          padding: 14px 36px;
          background: #111827;
          color: #fff;
          font-family: 'Sora', sans-serif;
          font-weight: 700;
          font-size: 1rem;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          letter-spacing: 0.01em;
          box-shadow: 0 4px 18px rgba(0,0,0,0.13);
          transition: background 0.18s, transform 0.15s, box-shadow 0.18s;
          animation: floatUp 0.9s 0.3s cubic-bezier(.22,1,.36,1) both;
        }

        .home-btn:hover {
          background: #1d4ed8;
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(29,78,216,0.22);
        }

        @keyframes floatUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="home-root">
        <canvas ref={canvasRef} className="home-canvas" />

        {/* Silhouette SVG matching the screenshot */}
        <div className="silhouette-wrap">
          <svg viewBox="0 0 340 260" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Left head silhouette */}
            <path
              d="M60 220 C60 180 30 160 28 130 C24 90 45 60 80 55 C115 50 138 80 135 120 C133 148 112 168 110 200 L110 220 Z"
              fill="#111827"
            />
            {/* Right head silhouette */}
            <path
              d="M280 220 C280 180 310 160 312 130 C316 90 295 60 260 55 C225 50 202 80 205 120 C207 148 228 168 230 200 L230 220 Z"
              fill="#111827"
            />
            {/* Body/shoulder left */}
            <path d="M60 220 Q85 235 110 220 L120 260 L50 260 Z" fill="#111827" />
            {/* Body/shoulder right */}
            <path d="M280 220 Q255 235 230 220 L220 260 L290 260 Z" fill="#111827" />

            {/* Network dots — left head area */}
            {[
              [72, 80], [95, 65], [58, 110], [90, 100], [75, 130],
              [50, 95], [105, 80],
            ].map(([cx, cy], i) => (
              <circle key={`l${i}`} cx={cx} cy={cy} r="3.5" fill="#00c8ff" opacity="0.85" />
            ))}
            {/* Network dots — right head area */}
            {[
              [268, 80], [245, 65], [282, 110], [250, 100], [265, 130],
              [290, 95], [235, 80],
            ].map(([cx, cy], i) => (
              <circle key={`r${i}`} cx={cx} cy={cy} r="3.5" fill="#00c8ff" opacity="0.85" />
            ))}
            {/* Center connecting dots */}
            {[[155, 100], [170, 80], [185, 105], [170, 120], [160, 70], [180, 70]].map(
              ([cx, cy], i) => (
                <circle key={`c${i}`} cx={cx} cy={cy} r="3" fill="#00c8ff" opacity="0.7" />
              )
            )}

            {/* Lines between nodes — left */}
            <line x1="72" y1="80" x2="95" y2="65" stroke="#00c8ff" strokeWidth="1" opacity="0.45" />
            <line x1="72" y1="80" x2="58" y2="110" stroke="#00c8ff" strokeWidth="1" opacity="0.45" />
            <line x1="95" y1="65" x2="90" y2="100" stroke="#00c8ff" strokeWidth="1" opacity="0.45" />
            <line x1="58" y1="110" x2="75" y2="130" stroke="#00c8ff" strokeWidth="1" opacity="0.45" />
            <line x1="90" y1="100" x2="75" y2="130" stroke="#00c8ff" strokeWidth="1" opacity="0.45" />
            <line x1="50" y1="95" x2="72" y2="80" stroke="#00c8ff" strokeWidth="1" opacity="0.35" />
            <line x1="105" y1="80" x2="90" y2="100" stroke="#00c8ff" strokeWidth="1" opacity="0.35" />

            {/* Lines — right */}
            <line x1="268" y1="80" x2="245" y2="65" stroke="#00c8ff" strokeWidth="1" opacity="0.45" />
            <line x1="268" y1="80" x2="282" y2="110" stroke="#00c8ff" strokeWidth="1" opacity="0.45" />
            <line x1="245" y1="65" x2="250" y2="100" stroke="#00c8ff" strokeWidth="1" opacity="0.45" />
            <line x1="282" y1="110" x2="265" y2="130" stroke="#00c8ff" strokeWidth="1" opacity="0.45" />
            <line x1="250" y1="100" x2="265" y2="130" stroke="#00c8ff" strokeWidth="1" opacity="0.45" />
            <line x1="290" y1="95" x2="268" y2="80" stroke="#00c8ff" strokeWidth="1" opacity="0.35" />
            <line x1="235" y1="80" x2="250" y2="100" stroke="#00c8ff" strokeWidth="1" opacity="0.35" />

            {/* Cross-head lines */}
            <line x1="105" y1="80" x2="155" y2="100" stroke="#00c8ff" strokeWidth="1" opacity="0.3" />
            <line x1="90" y1="100" x2="170" y2="80" stroke="#00c8ff" strokeWidth="1" opacity="0.25" />
            <line x1="235" y1="80" x2="185" y2="105" stroke="#00c8ff" strokeWidth="1" opacity="0.3" />
            <line x1="250" y1="100" x2="170" y2="120" stroke="#00c8ff" strokeWidth="1" opacity="0.25" />
            <line x1="155" y1="100" x2="185" y2="105" stroke="#00c8ff" strokeWidth="1" opacity="0.4" />
            <line x1="170" y1="80" x2="160" y2="70" stroke="#00c8ff" strokeWidth="1" opacity="0.4" />
            <line x1="170" y1="80" x2="180" y2="70" stroke="#00c8ff" strokeWidth="1" opacity="0.4" />

            {/* Small person in center top */}
            <circle cx="170" cy="42" r="6" fill="#00c8ff" opacity="0.9" />
            <line x1="170" y1="48" x2="170" y2="62" stroke="#00c8ff" strokeWidth="2" opacity="0.8" />
            <line x1="162" y1="53" x2="178" y2="53" stroke="#00c8ff" strokeWidth="2" opacity="0.8" />
            <line x1="170" y1="62" x2="164" y2="74" stroke="#00c8ff" strokeWidth="2" opacity="0.8" />
            <line x1="170" y1="62" x2="176" y2="74" stroke="#00c8ff" strokeWidth="2" opacity="0.8" />
          </svg>
        </div>

        <h1 className="home-title">Welcome to DebateGpt</h1>

        <p className="home-desc">
          Engage in dynamic debates with AI, challenge your perspectives, and
          broaden your horizons. DebateGpt offers a platform to explore diverse
          viewpoints through meaningful discussions. Ready to start your journey?
        </p>

        <button className="home-btn" onClick={() => navigate("/setup")}>
          Start a New Debate
        </button>
      </div>
    </>
  );
};

export default Home;
