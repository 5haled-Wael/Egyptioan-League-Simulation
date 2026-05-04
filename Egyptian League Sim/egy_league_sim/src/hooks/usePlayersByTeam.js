import { useEffect, useState } from "react";
import { getPlayersByTeam } from "../services/playerServices";

export const usePlayersByTeam = (teamId) => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!teamId) return;

    const load = async () => {
      const res = await getPlayersByTeam(teamId);
      setPlayers(res);
      setLoading(false);
    };
    load();
  }, [teamId]);

  return { players, loading };
};
