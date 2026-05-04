import { useState, useEffect } from "react";
import { getTeamById } from "../services/TeamServices";

export const useTeamById = (teamId) => {
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!teamId) return;

    const fetchTeam = async () => {
      try {
        setLoading(true);
        const data = await getTeamById(teamId);
        setTeam(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [teamId]);

  return { team, loading, error };
};
