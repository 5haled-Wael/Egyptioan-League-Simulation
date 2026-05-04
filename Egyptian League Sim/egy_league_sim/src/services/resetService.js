import api from "./api";

export const resetAllData = async () => {
  try {
    const res = await api.post("/Reset/reset-season");
    return res.data;
  } catch (err) {
    console.log("Error From Reset Service", err);
  }
};
