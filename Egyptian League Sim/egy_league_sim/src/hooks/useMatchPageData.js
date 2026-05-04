import { useMatchById } from "./useMatchById";
import { useNavigate } from "react-router-dom";
import { useTeamById } from "./useTeamById";
import { usePlayersByTeam } from "./usePlayersByTeam";
import { getMatchLineup } from "../utils/teamHelpers";
import { useStadium } from "./useStadium";
import { getTeamPositon } from "../utils/teamHelpers";
import { useStandings } from "./useStandings";

export const useMatchPageData = (id) => {
  const navigate = useNavigate();

  const { match: fixture } = useMatchById(id);
  const { standings } = useStandings();

  const homeId = fixture?.homeTeamID;
  const awayId = fixture?.awayTeamID;

  const { team: homeData } = useTeamById(homeId);
  const { team: awayData } = useTeamById(awayId);

  const { players: homePlayers } = usePlayersByTeam(homeId);
  const { players: awayPlayers } = usePlayersByTeam(awayId);

  const stadium = useStadium(fixture?.stadiumID);

  const home = homeData
    ? {
        id: homeId,
        name: homeData?.header?.teamName,
        logo: homeData?.header?.teamLogo,
      }
    : null;

  const away = awayData
    ? {
        id: awayId,
        name: awayData?.header?.teamName,
        logo: awayData?.header?.teamLogo,
      }
    : null;

  const isPlayed = fixture?.matchState === 2;

  const homeLineup = homePlayers?.length ? getMatchLineup(homePlayers) : null;
  const awayLineup = awayPlayers?.length ? getMatchLineup(awayPlayers) : null;

  const homePosition = getTeamPositon(standings, fixture?.homeTeamID);
  const awayPosition = getTeamPositon(standings, fixture?.awayTeamID);

  return {
    fixture,
    homeData,
    awayData,
    home,
    away,
    isPlayed,
    homeLineup,
    awayLineup,
    navigate,
    stadium,
    homePosition,
    awayPosition,
  };
};
