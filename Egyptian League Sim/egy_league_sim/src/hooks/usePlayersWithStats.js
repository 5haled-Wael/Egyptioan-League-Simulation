import { useEffect, useState } from "react";
import { getPlayersWithStats } from "../services/playerServices";

export const usePlayersWithStats = () => {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getPlayersWithStats();
      setPlayers(data);
    };

    fetchData();
  }, []);

  return players;
};
