import { useTeamMatches } from "./useTeamMatches";
import { useStandings } from "./useStandings";

export const useTeamFormData = (teamId) => {
  const { matches, loading } = useTeamMatches(teamId);
  const { standings } = useStandings();

  return { matches, loading, standings };
};
