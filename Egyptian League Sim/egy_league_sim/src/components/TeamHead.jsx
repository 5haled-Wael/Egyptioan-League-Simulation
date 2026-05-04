import { MdOutlineStadium } from "react-icons/md";
import "../styles/TeamPage.css";
import { useTeamHeadData } from "../hooks/useTeamHeadData";

export default function TeamHead({ teamId }) {
  const { team, loading } = useTeamHeadData(teamId);

  if (loading) return <div className="text-center p-5">Loading...</div>;
  if (!team) return <div className="text-center p-5">Team not found</div>;

  return (
    <div className="container mt-4">
      <div className="row team-head g-0 gap-4">
        {/* TEAM NAME + LOGO */}
        <div className="col-12 col-md-3 team-info d-flex align-items-center justify-content-center flex-column gap-2 p-3 rounded-3">
          <img src={team.logo} alt={team.name} />
          <p className="fs-3">{team.name}</p>
          <span>
            #{team.position} — {team.points} pts
          </span>
        </div>

        {/* Details */}
        <div className="col-12 col-md-9 team-details d-flex flex-column gap-3">
          <div className="d-flex flex-column flex-md-row align-items-center justify-content-center gap-4">
            {/* COACH */}
            <div className="text-center">
              <p className="fs-5 opacity-50 m-0">Head Coach</p>
              <h5 className="fs-3">{team.coach}</h5>
            </div>

            <div className="vr d-none d-md-block" />
            <hr className="d-md-none w-100 opacity-25 my-0" />

            {/* STADIUM */}
            <div className="d-flex align-items-center gap-2">
              <MdOutlineStadium size={28} />
              <span className="fw-semibold std-name">{team.stadium}</span>
            </div>
          </div>

          {/* STATS */}
          <div className="d-flex flex-wrap gap-3 justify-content-center align-items-center h-100">
            {[
              { label: "Played", value: team.played },
              { label: "Wins", value: team.wins },
              { label: "Draws", value: team.draws },
              { label: "Losses", value: team.losses },
              { label: "Goal Diff", value: team.goalDiff },
              { label: "Points", value: team.points },
              { label: "Market Value", value: team.marketValue },
            ].map((stat) => (
              <div
                key={stat.label}
                className="stat-box text-center border rounded-3 p-2 flex-grow-1"
                style={{ minWidth: "80px" }}
              >
                <span
                  className="fs-4 fw-bold"
                  style={{ color: "var(--color-highlight)" }}
                >
                  {stat.value}
                </span>
                <p className="small opacity-50 mb-0">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
