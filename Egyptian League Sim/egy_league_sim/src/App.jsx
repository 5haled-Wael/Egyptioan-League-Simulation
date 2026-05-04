import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

// COMPONENTS
import ScrollToTop from "./components/ScrollToTop";

// PAGES
import Home from "./pages/Home";
import MatchPage from "./pages/MatchPage";
import StandingsPage from "./pages/StandingsPage";
import TeamPage from "./pages/TeamPage";
import TeamPlayers from "./pages/TeamPlayers";
import Game from "./pages/Game";
import MatchsPage from "./pages/MatchsPage";
import LineUp from "./pages/LineUp";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/standings" element={<StandingsPage />} />
        <Route path="/matches" element={<MatchsPage />} />
        <Route path="/match/:id" element={<MatchPage />} />
        <Route path="/team/:id" element={<TeamPage />} />
        <Route path="/team/:id/players" element={<TeamPlayers />} />
        <Route path="/game" element={<Game />} />
        <Route path="/lineup" element={<LineUp />} />
      </Routes>
    </Router>
  );
}
export default App;
