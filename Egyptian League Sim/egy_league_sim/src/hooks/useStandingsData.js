import { useStandings } from "./useStandings";
import { getNumberOfTeams } from "../utils/teamHelpers.js";

export const useStandingsData = () => {
  const { standings, loading } = useStandings();
  const numOfTeams = getNumberOfTeams(standings);

  return { standings, numOfTeams, loading };
};
