import { useNavigate } from "react-router-dom";
import { useTeam } from "./useTeam";
import { useStadium } from "./useStadium";

export const useFixtureData = (fixtureData) => {
  const navigate = useNavigate();

  const home = useTeam(fixtureData.homeTeamID);
  const away = useTeam(fixtureData.awayTeamID);

  const isFT = fixtureData.matchState === 2;

  const stadium = useStadium(fixtureData.stadiumID);

  const handleClick = () => {
    navigate(`/match/${fixtureData.id}`, {
      state: { fixture: fixtureData },
    });
  };

  return {
    home,
    away,
    isFT,
    stadium,
    handleClick,
  };
};
