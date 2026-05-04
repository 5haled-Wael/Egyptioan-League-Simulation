import "../styles/TeamForm.css";
import { getResult } from "../utils/teamHelpers";
import { useTeamFormData } from "../hooks/useTeamFormData";

export default function TeamForm({ teamId }) {
  const { matches } = useTeamFormData(teamId);

  const last5 = matches.filter((m) => m.matchState === 1).slice(-5);

  if (last5.length === 0) return <span className="opacity-50">—</span>;

  return (
    <div>
      {last5.map((match, i) => {
        const r = getResult(match, teamId);
        return (
          <span
            key={i}
            className={r === "W" ? "win" : r === "L" ? "lose" : "draw"}
          >
            {r}
          </span>
        );
      })}
    </div>
  );
}
