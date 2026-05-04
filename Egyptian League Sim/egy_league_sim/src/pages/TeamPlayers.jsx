import "../styles/TeamPlayers.css";
import { useParams } from "react-router-dom";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import PlayerCard from "../components/PlayerCard";
import { useTeamPlayersData } from "../hooks/useTeamPlayersData";

export default function TeamPlayers() {
  const { id } = useParams();
  const teamId = Number(id);
  const { team, groupedPlayers, navigate } = useTeamPlayersData(teamId);

  return (
    <>
      <Nav />
      <div className="container mt-4">
        <div className="d-flex align-items-center gap-3 mb-4">
          <img
            src={team?.logo}
            alt={team?.name}
            className="team-players-logo"
          />
          <div>
            <h4 className="mb-0">{team?.name}</h4>
            <span className="opacity-50 small">Squad</span>
          </div>
          <button
            className="ms-auto btn-back"
            onClick={() => navigate(`/team/${teamId}`)}
          >
            Back to team
          </button>
        </div>

        {groupedPlayers.map((group) => (
          <div key={group.position} className="players-group mb-4">
            <p className="players-group-title">{group.position}s</p>
            <div className="players-grid">
              {group.players.map((player) => (
                <PlayerCard key={player.playerid} player={player} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <Footer
        mainTxt="Every team has a story, This is theirs"
        btnTxt="View upcoming matches"
      />
    </>
  );
}
