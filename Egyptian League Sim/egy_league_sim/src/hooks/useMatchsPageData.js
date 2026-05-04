import { useSearchParams } from "react-router-dom";
import { useMatches } from "../hooks/useMatches";
import { getMatchweekFixtures } from "../utils/teamHelpers";
import { getCurrentMatchweek } from "../utils/teamHelpers";

export const useMatchsPageData = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { matches } = useMatches();
  const currentMatchweek = getCurrentMatchweek(matches);
  const maxRound = currentMatchweek.matchweek;
  const round = Number(searchParams.get("round")) || maxRound;
  const fixtures = getMatchweekFixtures(matches, round);

  const setRound = (newRound) => {
    setSearchParams({ round: newRound });
  };

  return {
    fixtures,
    round,
    maxRound,
    setRound,
  };
};
