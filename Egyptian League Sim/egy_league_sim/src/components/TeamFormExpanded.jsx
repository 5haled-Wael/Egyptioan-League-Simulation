import "../styles/TeamForm.css";
import { getResult, getOpponent } from "../utils/teamHelpers";
import { useNavigate } from "react-router-dom";
import { useTeamFormData } from "../hooks/useTeamFormData";

export default function TeamFormExpanded({ teamId }) {
  const { matches, standings } = useTeamFormData(teamId);
  const navigate = useNavigate();

  return (
    <div className="team-form-expanded-wrapper container mt-4">
      <div className="team-form-expanded">
        {matches.map((match, i) => {
          const r = getResult(match, teamId);
          const opponent = getOpponent(standings, match, teamId);
          const isHome = match.homeTeam === teamId;
          const goalFor = isHome ? match.score.home : match.score.away;
          const goalsAgainst = isHome ? match.score.away : match.score.home;

          return (
            <div
              className="form-item"
              key={i}
              onClick={() => navigate(`/match/${match.id}`)}
            >
              <span className={r === "W" ? "win" : r === "L" ? "lose" : "draw"}>
                {r}
              </span>
              <span className="form-score">
                {goalFor} - {goalsAgainst}
              </span>
              <span
                className="form-opponent"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/team/${opponent.id}`);
                }}
              >
                vs {opponent?.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
