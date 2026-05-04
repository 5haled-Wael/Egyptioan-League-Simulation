import { setLineup } from "../services/squadService";
import { getPlayersByTeam } from "../services/playerServices";
import { getMatchLineup } from "../utils/teamHelpers";

export const useSquadSetup = () => {
  const getStarterIds = (lineup) =>
    [
      ...lineup.goalkeeper,
      ...lineup.defenders,
      ...lineup.midfielders,
      ...lineup.forwards,
    ].map((p) => p.playerid);

  const prepareSquadForMatch = async (matchId, homeTeamId, awayTeamId) => {
    console.log(
      "prepareSquadForMatch called:",
      matchId,
      homeTeamId,
      awayTeamId,
    );

    const [homePlayers, awayPlayers] = await Promise.all([
      getPlayersByTeam(homeTeamId),
      getPlayersByTeam(awayTeamId),
    ]);

    console.log("homePlayers count:", homePlayers?.length);
    console.log("awayPlayers count:", awayPlayers?.length);

    const homeLineup = getMatchLineup(homePlayers);
    const awayLineup = getMatchLineup(awayPlayers);

    const homeIds = getStarterIds(homeLineup);
    const awayIds = getStarterIds(awayLineup);

    console.log("homeStarterIds:", homeIds);
    console.log("awayStarterIds:", awayIds);

    await Promise.all([
      setLineup(matchId, homeTeamId, homeIds),
      setLineup(matchId, awayTeamId, awayIds),
    ]);

    console.log("Lineups set successfully for match:", matchId);
  };

  return { prepareSquadForMatch };
};
