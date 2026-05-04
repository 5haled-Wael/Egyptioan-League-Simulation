import api from "./api";

export const getStadiumById = async (id) => {
  try {
    const res = await api.get(`/stadium/details/${id}`);
    return res.data;
  } catch (err) {
    console.log("Error From Stadium Service", err);
  }
};
