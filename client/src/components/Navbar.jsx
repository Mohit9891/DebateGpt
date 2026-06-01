import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  const linkStyle = (path) =>
    `px-3 py-1 rounded-md transition ${
      location.pathname === path
        ? "bg-blue-100 text-blue-600"
        : "text-gray-600 hover:text-blue-500"
    }`;

  return (
    <nav className="w-full shadow-sm bg-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        
        {/* Logo */}
        <h1 className="text-xl font-bold text-gray-800">
          DebateGPT
        </h1>

        {/* Links */}
        <div className="flex gap-4 text-sm font-medium">
          <Link to="/" className={linkStyle("/")}>Home</Link>
          <Link to="/setup" className={linkStyle("/setup")}>Debate Setup</Link>
          <Link to="/chat" className={linkStyle("/chat")}>Debate Chat</Link>
          <Link to="/summary" className={linkStyle("/summary")}>Argument Summary</Link>
          <Link to="/feedback" className={linkStyle("/feedback")}>Feedback</Link>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;