import { useTeamMatches } from "./useTeamMatches";

export const useFixtureData = (teamId) => {
  const { matches } = useTeamMatches(teamId);
  const played = matches.filter((f) => f.matchState === 2);
  const upcoming = matches.filter((f) => f.matchState == 0);

  console.log("played:", played);
  console.log("upcoming:", upcoming);

  return { played, upcoming };
};
