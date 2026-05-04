import { useEffect, useState } from "react";
import { getStadiumById } from "../services/stadiumServices";

export const useStadium = (stadiumId) => {
  const [stadium, setStadium] = useState(null);

  useEffect(() => {
    if (!stadiumId) return;

    const fetchStadium = async () => {
      try {
        const data = await getStadiumById(stadiumId);
        setStadium(data);
      } catch (err) {
        console.log("Error From Stadium Service", err);
      }
    };

    fetchStadium();
  }, [stadiumId]);

  return stadium;
};
