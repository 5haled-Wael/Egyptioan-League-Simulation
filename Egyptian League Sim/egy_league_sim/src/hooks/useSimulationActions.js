import {
  simulateMatch,
  simulateWeek,
  simulateAllMatches,
  simulateRange,
} from "../services/simulationService";
import { useSquadSetup } from "./useSquadSetup";

export const useSimulationActions = () => {
  const { prepareSquadForMatch } = useSquadSetup();

  const runSimulateMatch = async (match) => {
    await prepareSquadForMatch(match.id, match.homeTeamID, match.awayTeamID);
    const result = await simulateMatch(match.id);
    console.log("simulate result for match", match.id, ":", result);
    return result;
  };

  const runSimulateWeek = async (weekNumber) => {
    try {
      const result = await simulateWeek(weekNumber);
      console.log(`Week ${weekNumber} simulation result:`, result);
      return result;
    } catch (error) {
      console.error(`Error simulating week ${weekNumber}:`, error);
      throw error;
    }
  };

  const runSimulateAllMatches = async () => {
    try {
      const result = await simulateAllMatches();
      console.log("All matches simulation result:", result);
      return result;
    } catch (error) {
      console.error("Error simulating all matches:", error);
      throw error;
    }
  };

  const runSimulateRange = async (fromWeek, toWeek) => {
    try {
      const result = await simulateRange(fromWeek, toWeek);
      console.log(`Weeks ${fromWeek}-${toWeek} simulation result:`, result);
      return result;
    } catch (error) {
      console.error(`Error simulating weeks ${fromWeek}-${toWeek}:`, error);
      throw error;
    }
  };

  return {
    runSimulateMatch,
    runSimulateWeek,
    runSimulateAllMatches,
    runSimulateRange,
  };
};
