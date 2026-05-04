import { useEffect, useState } from "react";
import { getAllPlayers } from "../services/playerServices";

export const usePlayers = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAllPlayers();
        setPlayers(data || []);
      } catch (error) {
        console.error("Error fetching players:", error);
        setPlayers([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return { players, loading };
};
