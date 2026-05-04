import { useEffect, useState } from "react";
import { getStandingsByWeek } from "../services/standingServices";

export const useStandingsByWeek = (weekNumber) => {
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!weekNumber) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const data = await getStandingsByWeek(weekNumber);
      setStandings(data);
      setLoading(false);
    };

    fetchData();
  }, [weekNumber]);

  return { standings, loading };
};
