import api from "./api";

const mapStanding = (t, index) => ({
  ...t,
  position: index + 1,
  team: {
    id: t.teamId,
    name: t.teamName,
    logo: t.logoUrl,
    logoUrl: t.logoUrl,
  },
});

export const getStandings = async () => {
  try {
    const res = await api.get("/LeagueStandings/standings");
    return res.data.map(mapStanding);
  } catch (error) {
    console.error("Error fetching standings:", error);
    return [];
  }
};

export const getCurrentStandings = async () => {
  try {
    const res = await api.get("/LeagueStandings/standings/current");
    return res.data;
  } catch (error) {
    console.error("Error fetching current standings:", error);
    return [];
  }
};

export const getStandingsByWeek = async (weekNumber) => {
  try {
    const res = await api.get(`/LeagueStandings/standings/week/${weekNumber}`);
    return res.data;
  } catch (error) {
    console.error(`Error fetching standings for week ${weekNumber}:`, error);
    return [];
  }
};

export const getLeagueProgress = async () => {
  try {
    const res = await api.get("/LeagueStandings/progress");
    return res.data;
  } catch (error) {
    console.error("Error fetching league progress:", error);
    return 0;
  }
};

export const getLeagueHighlights = async () => {
  try {
    const res = await api.get("/LeagueStandings/heighst");
    return res.data;
  } catch (error) {
    console.error("Error fetching league highlights:", error);
    return null;
  }
};

export const getLeagueLeader = async () => {
  try {
    const res = await api.get("/LeagueStandings/leader");
    return res.data;
  } catch (error) {
    console.error("Error fetching league leader:", error);
    return null;
  }
};
