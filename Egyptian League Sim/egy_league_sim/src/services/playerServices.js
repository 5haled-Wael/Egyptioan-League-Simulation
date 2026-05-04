import api from "./api";

export const getPlayersWithStats = async () => {
  try {
    const res = await api.get("/player/with-stats");
    return res.data;
  } catch (error) {
    console.error("Error fetching players:", error);
    return [];
  }
};

export const getPlayersByTeam = async (teamId) => {
  const res = await api.get(`/player/team/${teamId}`);
  return res.data;
};

export const getPlayerById = async (playerId) => {
  const res = await api.get(`/player/${playerId}`);
  return res.data;
};

export const getAllPlayers = async () => {
  const res = await api.get("/player");
  return res.data;
};

export const getTopScorers = async (limit = 10) => {
  try {
    const res = await api.get(`/Player/top-scorers?limit=${limit}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching top scorers:", error);
    return [];
  }
};

export const getTopScorersByLeague = async (leagueId, limit = 10) => {
  try {
    const res = await api.get(
      `/Player/top-scorers/league/${leagueId}?limit=${limit}`,
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching top scorers by league:", error);
    return [];
  }
};
