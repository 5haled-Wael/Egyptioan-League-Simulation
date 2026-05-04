import { useState, useEffect } from "react";
import { getTeamById } from "../services/teamServices";

export const useTeam = (teamId) => {
  const [team, setTeam] = useState(null);

  useEffect(() => {
    if (!teamId) return;
    const load = async () => {
      const res = await getTeamById(teamId);
      setTeam({
        id: teamId,
        name: res.header?.teamName,
        logo: res.header?.teamLogo,
        coach: res.header?.coachName,
        stadium: res.header?.stadiumName,
        stats: res.stats,
        nextMatch: res.header?.nextMatch,
        formGuide: res.header?.formGuide,
      });
    };
    load();
  }, [teamId]);

  return { team };
};
