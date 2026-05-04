import api from "./api";

export const simulateMatch = async (id) => {
  const res = await api.post(`/MatchesSimulation/simulate/${id}`);
  return res.data;
};

export const simulateWeek = async (weekNumber) => {
  const res = await api.post(`/MatchesSimulation/simulate-week/${weekNumber}`);
  return res.data;
};

export const simulateAllMatches = async () => {
  const res = await api.post("/MatchesSimulation/simulate-all");
  return res.data;
};

export const simulateRange = async (fromWeek, toWeek) => {
  const res = await api.post(
    `/MatchesSimulation/simulate-range?fromWeek=${fromWeek}&toWeek=${toWeek}`,
  );
  return res.data;
};

export const autoCreateSquads = async () => {
  try {
    const res = await api.post("/MatchesSimulation/auto-create-squads");
    return res.data;
  } catch (error) {
    console.error("Error auto creating squads:", error);
    throw error;
  }
};
