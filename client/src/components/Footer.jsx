import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 mt-auto">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-8 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* About Us */}
        <div>
          <h3 className="text-sm font-semibold text-gray-800 mb-2">About Us</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            DebateGPT is a platform designed to enhance your debating skills
            with AI-driven insights and summaries.
          </p>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-sm font-semibold text-gray-800 mb-2">Contact</h3>
          <p className="text-sm text-gray-500">Email: support@debategpt.com</p>
          <Link to="/feedback" className="text-sm text-gray-500 hover:text-gray-800">Send feedback</Link>
        </div>

        {/* Follow Us */}
        <div>
          <h3 className="text-sm font-semibold text-gray-800 mb-2">Follow Us</h3>
          <div className="flex gap-4 mt-1">
            {/* Facebook */}
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="text-gray-500 hover:text-gray-800 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
            {/* X */}
            <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="X" className="text-gray-500 hover:text-gray-800 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.9 2H22l-6.8 7.8L23.3 22h-6.3l-4.9-6.4L6.4 22H3.3l7.3-8.3L1 2h6.5l4.4 5.9L18.9 2zm-1.1 18h1.7L7.6 3.9H5.7L17.8 20z"/>
              </svg>
            </a>
            {/* Instagram */}
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="text-gray-500 hover:text-gray-800 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 bg-gray-100">
        <div className="max-w-7xl mx-auto px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-gray-400">
          <span>© {new Date().getFullYear()} DebateGPT. All rights reserved.</span>
          <div className="flex gap-4">
            <Link to="/history" className="hover:text-gray-600 transition-colors">History</Link>
            <Link to="/feedback" className="hover:text-gray-600 transition-colors">Feedback</Link>
            <Link to="/setup" className="hover:text-gray-600 transition-colors">Start a Debate</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
