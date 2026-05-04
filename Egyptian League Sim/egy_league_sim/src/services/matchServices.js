import api from "./api";

const mapMatch = (m) => ({
  id: m.id,
  homeTeamID: m.homeTeamID,
  awayTeamID: m.awayTeamID,
  homeTeamScore: m.homeTeamScore,
  awayTeamScore: m.awayTeamScore,
  matchState: m.matchState,
  matchdate: m.matchdate ? new Date(m.matchdate).toISOString() : null,
  matchtime: m.matchtime,
  stadiumID: m.stadiumID,
  week: m.week === 0 ? 1 : m.week,
  score: {
    home: m.homeTeamScore ?? 0,
    away: m.awayTeamScore ?? 0,
  },
});

export const getAllMatches = async () => {
  const res = await api.get("/Match/all-matches");
  return res.data.map(mapMatch);
};

export const getMatchById = async (id) => {
  const res = await api.get(`/Match/${id}`);
  return mapMatch(res.data);
};

export const getMatchesByTeam = async (teamId) => {
  const res = await api.get(`/match/team/${teamId}`);
  return res.data.map(mapMatch);
};
