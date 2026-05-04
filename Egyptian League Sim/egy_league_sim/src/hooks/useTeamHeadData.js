import { useTeam } from "./useTeam";
import { useStandings } from "./useStandings";
import { usePlayersByTeam } from "./usePlayersByTeam";
import { getTeamHeadData } from "../utils/teamHelpers";

export const useTeamHeadData = (teamId) => {
  const { team: rawTeam } = useTeam(teamId);
  const { standings, loading: standingsLoading } = useStandings();
  const { players, loading: playersLoading } = usePlayersByTeam(teamId);

  const loading = !rawTeam || standingsLoading || playersLoading;

  const team = getTeamHeadData(rawTeam, standings, players);

  return { team, loading };
};
