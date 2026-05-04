import { useCurrentStandings } from "./useCurrentStandings";
import { useMatches } from "./useMatches";
import { useTopScorers } from "./useTopScorers";
import {
  getCurrentMatchweek,
  getNumberOfMatchesPlayed,
  getSeasonProgress,
  getTotalMatches,
} from "../utils/teamHelpers";

export const useFeatureData = () => {
  const { standings, loading: standingsLoading } = useCurrentStandings();
  const { matches, loading: matchesLoading } = useMatches();
  const { topScorers, loading: topScorersLoading } = useTopScorers(10);

  const isLoading = standingsLoading || matchesLoading || topScorersLoading;

  const leader = standings[0] || null;

  const firstTeam = leader
    ? {
        id: leader.teamId,
        name: leader.teamName,
        logo: leader.logoUrl,
        points: leader.points,
        wins: leader.won,
        draws: leader.drawn,
        losses: leader.lost,
      }
    : null;

  const topScorer = topScorers[0] || null;

  const seasonProg = getSeasonProgress(matches);
  const numberOfMatchesPlayed = getNumberOfMatchesPlayed(matches);
  const currentMatchweekData = getCurrentMatchweek(matches);

  const currentMatchweek = {
    ...currentMatchweekData,
    avgGoals: currentMatchweekData.avgGoals ?? "0.00",
    cleanSheets: currentMatchweekData.cleanSheets ?? 0,
  };
  const totalMatches = getTotalMatches(18);

  return {
    isLoading,
    firstTeam,
    topScorer,
    seasonProg,
    numberOfMatchesPlayed,
    currentMatchweek,
    totalMatches,
  };
};
