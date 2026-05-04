// components/Nav.jsx
import "../styles/Nav.css";
import { GoTrophy } from "react-icons/go";
import { MdOutlineHome } from "react-icons/md";
import { MdOutlineSportsSoccer } from "react-icons/md";
import { IoGameController } from "react-icons/io5";
import { FaUserFriends } from "react-icons/fa";
import { MdLogin } from "react-icons/md";
import { MdTableChart } from "react-icons/md";
import { NavLink, Link } from "react-router-dom";
import { useMatches } from "../hooks/useMatches";
import { useStandings } from "../hooks/useStandings";
import { useTopScorers } from "../hooks/useTopScorers";
import { resetAllData } from "../services/resetService";

const navItem = [
  { name: "Home", icon: MdOutlineHome, path: "/" },
  { name: "Standings", icon: MdTableChart, path: "/standings" },
  { name: "Matches", icon: MdOutlineSportsSoccer, path: "/matches" },
  { name: "Game", icon: IoGameController, path: "/game" },
  { name: "Line Up", icon: FaUserFriends, path: "/lineup" },
  { name: "Login", icon: MdLogin, path: "/login" },
];

export default function Nav({ isHome = false }) {
  const { refetch: refetchMatches } = useMatches();
  const { refetch: refetchStandings } = useStandings();
  const { refetch: refetchTopScorers } = useTopScorers();

  const handleReset = async () => {
    if (
      !window.confirm(
        "⚠️ You are about to reset ALL data! This includes standings, top scorers, matches, and lineups. Are you sure?",
      )
    ) {
      return;
    }

    try {
      const result = await resetAllData();
      console.log("Reset result:", result);

      // تحديث كل البيانات بعد الـ Reset
      await Promise.all([
        refetchMatches(),
        refetchStandings(),
        refetchTopScorers(),
      ]);

      alert("✅ All data has been reset successfully!");

      // إعادة تحميل الصفحة للتأكد من تحديث كل شيء
      window.location.reload();
    } catch (error) {
      console.error("Reset failed:", error);
      alert("❌ Reset failed. Please try again.");
    }
  };

  return (
    <>
      <nav
        className={`my-nav navbar navbar-expand-lg ${isHome ? "over-hero" : ""}`}
      >
        <div className="container-fluid">
          <div className="icon mx-lg-3 text-center">
            <GoTrophy className="fs-1 h-100" />
          </div>
          <div>
            <Link
              to="/"
              className="navbar-brand nav-link p-0 fw-bold fs-6 fs-lg-3 m-0"
            >
              Egyptian Premier League
            </Link>
            <p className="m-0 opacity-50">Season Simulator 2025/2026</p>
          </div>
          <button
            className="navbar-toggler p-1"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse mt-3 mt-lg-0" id="navbarNav">
            <ul className="navbar-nav ms-auto me-2 gap-2">
              {navItem.map((item) => (
                <li className="nav-item" key={item.name}>
                  <NavLink
                    to={item.path}
                    end={item.path === "/"}
                    className={({ isActive }) =>
                      `nav-link d-flex align-items-center justify-content-center ${isActive ? "active" : ""}`
                    }
                  >
                    <item.icon className="fs-4 me-1" />
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* RESET BUTTON */}
            <button
              onClick={handleReset}
              className="btn btn-sm btn-outline-danger opacity-50 ms-2"
              style={{ fontSize: "11px" }}
            >
              Reset Season
            </button>
            {/*== RESET BUTTON ==*/}
          </div>
        </div>
      </nav>
    </>
  );
}
