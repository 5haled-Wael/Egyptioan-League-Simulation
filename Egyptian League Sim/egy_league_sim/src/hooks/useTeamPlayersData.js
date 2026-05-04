import { useNavigate } from "react-router-dom";
import { usePlayersByTeam } from "./usePlayersByTeam";
import { useTeamById } from "./useTeamById";
import { useMemo } from "react";

const POSITION_GROUPS = {
  Goalkeeper: "Goalkeeper",
  "Right-Back": "Defender",
  "Centre-Back": "Defender",
  "Left-Back": "Defender",
  "Defensive Midfield": "Midfielder",
  "Central Midfield": "Midfielder",
  "Attacking Midfield": "Midfielder",
  "Right Winger": "Forward",
  "Centre-Forward": "Forward",
  "Left Winger": "Forward",
  "Second Striker": "Forward",
};

const GROUP_ORDER = ["Goalkeeper", "Defender", "Midfielder", "Forward"];

export const useTeamPlayersData = (teamId) => {
  const navigate = useNavigate();
  const { players = [] } = usePlayersByTeam(teamId);
  const { team: rawData } = useTeamById(teamId);

  const team = rawData?.header
    ? {
        name: rawData.header.teamName,
        logo: rawData.header.teamLogo,
      }
    : null;

  const groupedPlayers = useMemo(() => {
    return GROUP_ORDER.map((group) => ({
      position: group,
      players: players
        .filter((p) => POSITION_GROUPS[p.position] === group)
        .sort((a, b) => b.power - a.power),
    })).filter((g) => g.players.length > 0);
  }, [players]);

  return { navigate, team, groupedPlayers };
};
