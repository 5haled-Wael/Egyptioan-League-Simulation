import { createContext, useState, useEffect } from "react";
import { getAllMatches } from "../services/matchServices";

export const MatchesContext = createContext();

export const MatchesProvider = ({ children }) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMatches = async () => {
    try {
      const data = await getAllMatches();
      setMatches(data || []);
    } catch (error) {
      console.error("Error fetching matches:", error);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  return (
    <MatchesContext.Provider
      value={{ matches, loading, refetch: fetchMatches }}
    >
      {children}
    </MatchesContext.Provider>
  );
};
