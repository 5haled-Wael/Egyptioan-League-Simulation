import { useMatches } from "../hooks/useMatches";
import { getCurrentMatchweek, getPlayedMatchweeks } from "../utils/teamHelpers";

export const useSimulationData = () => {
  const { matches } = useMatches();

  const currentMatchweek = getCurrentMatchweek(matches);
  const totalMatchweeks = 34;
  const playedMatchweeks = getPlayedMatchweeks(matches);
  const progress = Math.round((playedMatchweeks / totalMatchweeks) * 100);
  const remainingMatchweeks = totalMatchweeks - playedMatchweeks;

  return {
    currentMatchweek,
    totalMatchweeks,
    playedMatchweeks,
    progress,
    remainingMatchweeks,
  };
};
