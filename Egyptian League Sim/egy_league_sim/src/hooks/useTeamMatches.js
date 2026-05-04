import { useEffect, useState } from "react";
import { getMatchesByTeam } from "../services/matchServices";

export const useTeamMatches = (teamId) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!teamId) return;
    const load = async () => {
      const res = await getMatchesByTeam(teamId);
      setMatches(res);
      setLoading(false);
    };
    load();
  }, [teamId]);

  return { matches, loading };
};
