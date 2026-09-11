import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const linkStyle = (path) =>
    `px-3 py-1 rounded-md transition ${
      location.pathname === path || location.pathname.startsWith(path + "/")
        ? "bg-blue-100 text-blue-600"
        : "text-gray-600 hover:text-blue-500"
    }`;

  return (
    <nav className="w-full shadow-sm bg-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        {/* Logo — Link for a11y, single h1 per page lives in pages */}
        <Link to="/" className="text-xl font-bold text-gray-800 no-underline">
          DebateGPT
        </Link>

        {/* Links — try-a-debate open, rest need login */}
        <div className="flex gap-2 text-sm font-medium items-center">
          <Link to="/" className={linkStyle("/")}>Home</Link>
          <Link to="/setup" className={linkStyle("/setup")}>Try Debate</Link>
          <Link to="/history" className={linkStyle("/history")}>History</Link>
          <Link to="/analytics" className={linkStyle("/analytics")}>Analytics</Link>
          <Link to="/feedback" className={linkStyle("/feedback")}>Feedback</Link>
          {user ? (
            <>
              {user.avatar
                ? <img src={user.avatar} alt="" style={{ width: 28, height: 28, borderRadius: "50%" }} />
                : <span style={{ fontSize: "0.8rem", color: "#374151", maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name || user.email}</span>}
              <button
                onClick={() => { logout(); navigate("/"); }}
                style={{ padding: "6px 14px", border: "1px solid #e5e7eb", borderRadius: 6, background: "#fff", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600 }}
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className={linkStyle("/login")}>Login</Link>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;