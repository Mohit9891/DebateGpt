import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import DebateSetup from "./pages/DebateSetup";
import DebateChat from "./pages/DebateChat";
import ArgumentSummary from "./pages/ArgumentSummary";
import Feedback from "./pages/Feedback";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/setup" element={<DebateSetup />} />
        <Route path="/chat" element={<DebateChat />} />
        <Route path="/summary" element={<ArgumentSummary />} />
        <Route path="/feedback" element={<Feedback />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
