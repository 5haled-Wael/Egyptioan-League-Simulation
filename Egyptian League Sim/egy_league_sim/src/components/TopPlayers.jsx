import "../styles/TopPlayers.css";
import { usePlayersByTeam } from "../hooks/usePlayersByTeam";
import { getInitials } from "../utils/matchHelpers";

export default function TopPlayers({ teamId }) {
  const { players = [] } = usePlayersByTeam(teamId);
  const top = players
    .sort((a, b) => b.goals + b.assists - (a.goals + a.assists))
    .slice(0, 4);

  return (
    <div className="top-players container mt-4">
      {top.map((player) => (
        <div key={player.playerid} className="player-card">
          <div className="player-avatar">
            {player.image ? (
              <img src={player.playerImage} alt={player.name} />
            ) : (
              <span>{getInitials(player.name)}</span>
            )}
          </div>
          <div className="player-info">
            <p className="player-name">{player.name}</p>
            <p className="player-pos">{player.position}</p>
          </div>
          <div className="player-stats">
            <div className="pstat">
              <span className="pstat-value">{player.goals}</span>
              <span className="pstat-label">Goals</span>
            </div>
            <div className="pstat">
              <span className="pstat-value">{player.assists}</span>
              <span className="pstat-label">Assists</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
