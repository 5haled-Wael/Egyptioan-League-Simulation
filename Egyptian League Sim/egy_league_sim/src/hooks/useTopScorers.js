// hooks/useTopScorers.js
import { useEffect, useState, useCallback } from "react";
import { getTopScorers } from "../services/playerServices";

export const useTopScorers = (limit = 10) => {
  const [topScorers, setTopScorers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTopScorers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTopScorers(limit);
      setTopScorers(data);
    } catch (error) {
      console.error("Error fetching top scorers:", error);
      setTopScorers([]);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchTopScorers();
  }, [fetchTopScorers]);

  return { topScorers, loading, refetch: fetchTopScorers };
};
