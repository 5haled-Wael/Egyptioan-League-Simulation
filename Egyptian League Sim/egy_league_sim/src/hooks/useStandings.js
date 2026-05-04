// hooks/useStandings.js
import { useEffect, useState, useCallback } from "react";
import { getStandings } from "../services/standingsServices";

export const useStandings = () => {
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStandings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getStandings();
      setStandings(data || []);
    } catch (error) {
      console.error("Error fetching standings:", error);
      setStandings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStandings();
  }, [fetchStandings]);

  return { standings, loading, refetch: fetchStandings };
};
