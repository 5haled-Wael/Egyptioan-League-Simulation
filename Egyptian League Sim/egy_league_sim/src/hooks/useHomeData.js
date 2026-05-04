import { useMatches } from "../hooks/useMatches";
import { getMatchweekFixtures } from "../utils/teamHelpers";
import { getCurrentMatchweek } from "../utils/teamHelpers";

export const useHomeData = () => {
  const { matches } = useMatches();
  const currentMatchweek = getCurrentMatchweek(matches);
  const round = currentMatchweek.matchweek;
  const fixtures = getMatchweekFixtures(matches, round);

  return {
    fixtures,
    matchweek: round,
  };
};
