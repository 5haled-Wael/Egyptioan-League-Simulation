import { useStandings } from "./useStandings";
import { useMatches } from "../hooks/useMatches";
import {
  getMostTeamScored,
  getBestDefense,
  getBiggestClimb,
  getBiggestDrop,
  getMostGoalConceded,
  getHightGoalDifference,
  getBestHomeRecord,
  getBestAwayRecord,
} from "../utils/teamHelpers";

export const useTeamStates = () => {
  const { standings = [] } = useStandings();
  const { matches = [] } = useMatches();

  const mostGoals = getMostTeamScored(standings);
  const bestDefense = getBestDefense(standings);

  const biggestClimb = getBiggestClimb(standings, matches);
  const biggestDrop = getBiggestDrop(standings, matches);
  const mostGoalConceded = getMostGoalConceded(standings);
  const hightGoalDifference = getHightGoalDifference(standings);

  const bestHomeRecord = getBestHomeRecord(standings, matches);
  const bestAwayRecord = getBestAwayRecord(standings, matches);

  if (!Array.isArray(standings) || standings.length === 0) {
    return {};
  }

  return {
    mostGoals,
    bestDefense,
    biggestClimb,
    biggestDrop,
    mostGoalConceded,
    hightGoalDifference,
    bestHomeRecord,
    bestAwayRecord,
  };
};
