// STYLES
import "../styles/Standings.css";
// COMPONENTS
import TeamForm from "./TeamForm.jsx";
// ROUTES
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
// HOOKS
import { useStandingsData } from "../hooks/useStandingsData.js";

export default function Standings({ All }) {
  const { standings = [] } = useStandingsData();
  const navigate = useNavigate();
  const visibleStandings = All ? standings : standings.slice(0, 5);

  return (
    <div className="container mt-4">
      {/* LABLE */}
      {!All && (
        <div className="d-flex justify-content-between align-items-center">
          <h4>Standings</h4>
          <Link to="/standings" className="opacity-50">
            View All
          </Link>
        </div>
      )}

      {/* ── LABLE ── */}
      {/* TABLE */}
      <table className="table std text-center mt-2">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col" className="text-start">
              Team
            </th>
            <th scope="col">MP</th>
            <th scope="col" className="d-none d-lg-table-cell">
              W
            </th>
            <th scope="col" className="d-none d-lg-table-cell">
              D
            </th>
            <th scope="col" className="d-none d-lg-table-cell">
              L
            </th>
            <th scope="col" className="d-none d-lg-table-cell">
              GF
            </th>
            <th scope="col" className="d-none d-lg-table-cell">
              GA
            </th>
            <th scope="col" className="d-none d-lg-table-cell">
              GD
            </th>
            <th scope="col">Pts</th>
            <th scope="col" className="d-none d-md-table-cell d-lg-table-cell">
              Last 5
            </th>
          </tr>
        </thead>
        <tbody>
          {visibleStandings.map((team) => (
            <tr
              key={team.team.id}
              className={
                team.position <= 2
                  ? "champions"
                  : team.position <= 4
                    ? "confederation"
                    : team.position >= 16
                      ? "relegation"
                      : ""
              }
              onClick={() => navigate(`/team/${team.team.id}`)}
            >
              <th scope="row">{team.position}</th>
              <td>
                <div className="d-flex align-items-center">
                  <span
                    className="teamLogoWrapper"
                    style={{ backgroundImage: `url(${team.team.logo})` }}
                  />
                  {team.team.name}
                </div>
              </td>
              <td>{team.played}</td>
              <td className="d-none d-lg-table-cell">{team.won}</td>
              <td className="d-none d-lg-table-cell">{team.drawn}</td>
              <td className="d-none d-lg-table-cell">{team.lost}</td>
              <td className="d-none d-lg-table-cell">{team.goalsFor}</td>
              <td className="d-none d-lg-table-cell">{team.goalsAgainst}</td>
              <td className="d-none d-lg-table-cell">{team.goalDifference}</td>
              <td>{team.points}</td>
              <td className="d-none d-md-table-cell d-lg-table-cell">
                <TeamForm teamId={team.team.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* ── TABLE ── */}
    </div>
  );
}
