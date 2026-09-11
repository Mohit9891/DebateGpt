import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

const Login = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { user, loginWithGoogle } = useAuth();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const btnRef = useRef(null);
  const next = params.get("next") || "/history";

  useEffect(() => {
    if (user) navigate(next, { replace: true });
  }, [user]);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || user) return;
    const render = () => {
      if (!window.google?.accounts?.id || !btnRef.current) return;
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (resp) => {
          setBusy(true);
          setError("");
          try {
            await loginWithGoogle(resp.credential);
            navigate(next, { replace: true });
          } catch (e) {
            setError(e.message || "Google sign-in failed.");
          } finally {
            setBusy(false);
          }
        },
      });
      window.google.accounts.id.renderButton(btnRef.current, { theme: "filled_black", size: "large", width: 280 });
    };
    if (document.getElementById("google-gsi")) return render();
    const s = document.createElement("script");
    s.id = "google-gsi";
    s.src = "https://accounts.google.com/gsi/client";
    s.async = true;
    s.defer = true;
    s.onload = render;
    document.head.appendChild(s);
  }, [user]);

  return (
    <div style={{ minHeight: "calc(100vh - 130px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ maxWidth: 420, width: "100%", textAlign: "center", border: "1px solid #e5e7eb", borderRadius: 12, padding: 40 }}>
        <h1 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: 8 }}>Login to DebateGPT</h1>
        <p style={{ color: "#6b7280", fontSize: "0.9rem", marginBottom: 24, lineHeight: 1.6 }}>
          Trying a debate is free without login. But summaries, history and analytics need an account — so we can save your debates.
        </p>
        {!GOOGLE_CLIENT_ID ? (
          <p style={{ color: "#b45309", background: "#fef3c7", borderRadius: 8, padding: 12, fontSize: "0.85rem" }}>
            Missing <code>VITE_GOOGLE_CLIENT_ID</code> in <code>client/.env</code>. Create a Web OAuth client in Google Cloud Console and add it.
          </p>
        ) : (
          <>
            <div ref={btnRef} style={{ display: "flex", justifyContent: "center", minHeight: 44 }} />
            {busy && <p style={{ color: "#6b7280", fontSize: "0.85rem", marginTop: 12 }}>Signing you in...</p>}
          </>
        )}
        {error && <p style={{ color: "#ef4444", fontSize: "0.85rem", marginTop: 12 }}>{error}</p>}
        <button onClick={() => navigate("/setup")} style={{ marginTop: 20, background: "none", border: "none", color: "#6b7280", cursor: "pointer", fontSize: "0.85rem", textDecoration: "underline" }}>
          Continue as guest (try a debate)
        </button>
      </div>
    </div>
  );
};

export default Login;
