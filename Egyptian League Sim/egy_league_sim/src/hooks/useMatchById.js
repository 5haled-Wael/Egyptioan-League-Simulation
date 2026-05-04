import { useState, useEffect } from "react";
import { getMatchById } from "../services/matchServices";

export const useMatchById = (matchId) => {
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (!matchId) return;

    const fetchMatch = async () => {
      try {
        setLoading(true);
        const data = await getMatchById(matchId);
        setMatch(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMatch();
  }, [matchId]);

  return { match, loading, error };
};
