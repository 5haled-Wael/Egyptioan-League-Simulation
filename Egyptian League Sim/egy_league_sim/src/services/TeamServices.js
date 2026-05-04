import api from "./api";

export const getTeamById = async (teamId) => {
  try {
    const res = await api.get(`/Teams/${teamId}/details`);
    return res.data;
  } catch (err) {
    console.log("Error From Team Service", err);
  }
};
