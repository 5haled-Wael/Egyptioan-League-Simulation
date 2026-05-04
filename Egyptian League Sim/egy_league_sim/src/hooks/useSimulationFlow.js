// hooks/useSimulationFlow.js
import { useState, useRef } from "react";
import { useSimulationActions } from "./useSimulationActions";
import { useSimulationData } from "./useSimulatonData";
import { useMatches } from "./useMatches";
import { getMatchesByWeek } from "../utils/matchHelpers";

export const useSimulationFlow = () => {
  const [isSimulating, setIsSimulating] = useState(false);
  const { runSimulateWeek, runSimulateAllMatches, runSimulateRange } =
    useSimulationActions();
  const { currentMatchweek, totalMatchweeks } = useSimulationData();
  const { matches, refetch } = useMatches();

  const matchesRef = useRef(matches);
  matchesRef.current = matches;

  const handleNextWeek = async () => {
    if (isSimulating) return;
    setIsSimulating(true);
    try {
      const nextWeek = currentMatchweek.started
        ? currentMatchweek.matchweek + 1
        : currentMatchweek.matchweek;

      const weekMatches = getMatchesByWeek(matchesRef.current, nextWeek);
      const result = await runSimulateWeek(nextWeek, weekMatches);

      await refetch();
      console.log("=== WEEK DONE ===");
      return result;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    } finally {
      setIsSimulating(false);
    }
  };

  const handleNext5Weeks = async () => {
    if (isSimulating) return;
    setIsSimulating(true);
    try {
      const startWeek = currentMatchweek.started
        ? currentMatchweek.matchweek + 1
        : currentMatchweek.matchweek;
      const endWeek = Math.min(startWeek + 4, totalMatchweeks);

      let result;
      if (startWeek <= totalMatchweeks) {
        result = await runSimulateRange(startWeek, endWeek);
      }

      await refetch();
      console.log("=== 5 WEEKS DONE ===");
      return result;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    } finally {
      setIsSimulating(false);
    }
  };

  const handleEndSeason = async () => {
    if (isSimulating) return;
    setIsSimulating(true);
    try {
      const result = await runSimulateAllMatches();
      await refetch();
      console.log("=== SEASON DONE ===");
      return result;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    } finally {
      setIsSimulating(false);
    }
  };

  return {
    handleNextWeek,
    handleNext5Weeks,
    handleEndSeason,
    isSimulating,
  };
};
