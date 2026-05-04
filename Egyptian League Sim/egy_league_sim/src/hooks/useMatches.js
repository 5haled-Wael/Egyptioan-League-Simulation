import { useContext } from "react";
import { MatchesContext } from "../contexts/MatchesContext";

export const useMatches = () => useContext(MatchesContext);
