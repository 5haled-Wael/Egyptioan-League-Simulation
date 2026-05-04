import { useEffect, useState } from "react";
import {
  getLeagueHighlights,
  getLeagueLeader,
  getLeagueProgress,
} from "../services/standingServices";

export const useLeagueHighlights = () => {
  const [highlights, setHighlights] = useState(null);
  const [leader, setLeader] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [highlightsData, leaderData, progressData] = await Promise.all([
        getLeagueHighlights(),
        getLeagueLeader(),
        getLeagueProgress(),
      ]);
      setHighlights(highlightsData);
      setLeader(leaderData);
      setProgress(progressData);
      setLoading(false);
    };

    fetchData();
  }, []);

  return { highlights, leader, progress, loading };
};
