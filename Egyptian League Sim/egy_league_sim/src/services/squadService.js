import api from "./api";

export const setLineup = async (matchId, teamId, starterIds) => {
  const res = await api.post("/MatchSquad/set-lineup", {
    matchId,
    teamId,
    selectedStarterIds: starterIds,
  });
  return res.data;
};
