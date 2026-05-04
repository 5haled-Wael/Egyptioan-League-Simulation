import { useState, useEffect } from "react";
import { getPlayerById } from "../services/api";

export const usePlayerById = (playerId) => {
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const playerData = await getPlayerById(playerId);
        setPlayer(playerData);
      } catch (error) {
        console.error("Error fetching player data:", error);
      }
    };

    fetchPlayer();
  }, [playerId]);

  return player;
};
