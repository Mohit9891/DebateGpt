import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import DebateSetup from "./pages/DebateSetup";
import DebateChat from "./pages/DebateChat";
import ArgumentSummary from "./pages/ArgumentSummary";
import Feedback from "./pages/Feedback";
import History from "./pages/History";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Analytics from "./pages/Analytics";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* PUBLIC: try DebateGPT without login */}
        <Route path="/" element={<Home />} />
        <Route path="/setup" element={<DebateSetup />} />
        <Route path="/chat" element={<DebateChat />} />
        <Route path="/chat/:id" element={<DebateChat />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/login" element={<Login />} />
        {/* LOGIN REQUIRED: summaries, history, analytics */}
        <Route path="/summary" element={<ProtectedRoute><ArgumentSummary /></ProtectedRoute>} />
        <Route path="/summary/:id" element={<ProtectedRoute><ArgumentSummary /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
