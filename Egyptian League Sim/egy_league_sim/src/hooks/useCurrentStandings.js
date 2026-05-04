import { useEffect, useState } from "react";
import { getCurrentStandings } from "../services/standingsServices";

export const useCurrentStandings = () => {
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await getCurrentStandings();
      setStandings(data);
      setLoading(false);
    };

    fetchData();
  }, []);

  return { standings, loading };
};
