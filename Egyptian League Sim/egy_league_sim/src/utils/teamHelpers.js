import { formatMarketValue } from "./matchHelpers";

export const getCurrentMatchweek = (fixtures = []) => {
  if (!fixtures.length) {
    return {
      matchweek: 1,
      matches: 0,
      goals: 0,
      avgGoals: "0.00",
      cleanSheets: 0,
      dateRange: { from: null, to: null },
      started: false,
    };
  }

  const playedFixtures = fixtures.filter(
    (f) => f.homeTeamScore !== null && f.awayTeamScore !== null,
  );

  if (!playedFixtures.length) {
    const firstWeek = Math.min(...fixtures.map((f) => f.week));
    const weekFixtures = fixtures.filter((f) => f.week === firstWeek);

    return {
      matchweek: firstWeek,
      matches: weekFixtures.length,
      goals: 0,
      avgGoals: "0.00",
      cleanSheets: 0,
      started: false,
      dateRange: {
        from: weekFixtures[0]?.matchdate,
        to: weekFixtures.at(-1)?.matchdate,
      },
    };
  }

  const currentWeek = Math.max(...playedFixtures.map((f) => f.week));
  const weekFixtures = fixtures.filter((f) => f.week === currentWeek);

  const totalGoals = weekFixtures.reduce(
    (sum, f) => sum + (f.homeTeamScore ?? 0) + (f.awayTeamScore ?? 0),
    0,
  );

  const avgGoals =
    weekFixtures.length > 0
      ? (totalGoals / weekFixtures.length).toFixed(2)
      : "0.00";

  const cleanSheets = weekFixtures.filter(
    (f) => f.homeTeamScore === 0 || f.awayTeamScore === 0,
  ).length;

  return {
    matchweek: currentWeek,
    matches: weekFixtures.length,
    goals: totalGoals,
    avgGoals: avgGoals,
    cleanSheets: cleanSheets,
    started: true,
    dateRange: {
      from: weekFixtures[0]?.matchdate,
      to: weekFixtures.at(-1)?.matchdate,
    },
  };
};

export const getLeagueLeader = (standings = []) => {
  if (!Array.isArray(standings) || standings.length === 0) return null;

  return [...standings].sort((a, b) => b.points - a.points)[0];
};

export const getNumberOfMatchesPlayed = (fixtures = []) =>
  fixtures.filter((f) => f.matchState === 2).length;

export const getSeasonProgress = (fixtures = []) => {
  const played = getNumberOfMatchesPlayed(fixtures);
  return Math.round((played / 306) * 100);
};

export const getFixtureById = (fixtures = [], fixtureId) => {
  return fixtures.find((f) => f.id === parseInt(fixtureId));
};

export const getResult = (f, teamId) => {
  const isHome = f.homeTeam === teamId;
  const scored = isHome ? f.homeTeamScore : f.awayTeamScore;
  const conceded = isHome ? f.awayTeamScore : f.homeTeamScore;

  if (scored > conceded) return "W";
  if (scored === conceded) return "D";
  return "L";
};

export const getOpponent = (standings, f, teamId) => {
  const oppId = f.homeTeam === teamId ? f.awayTeam : f.homeTeam;
  return standings.find((t) => t.team.id === oppId)?.team;
};

export const getMarketValue = (players = []) => {
  return formatMarketValue(
    players.reduce((total, p) => total + (p.marketValue ?? 0), 0),
  );
};

export const getMatchweekFixtures = (fixtures = [], round) => {
  return fixtures.filter((f) => f.week === round);
};

export const getRoundPlayedMatches = (fixturesList = [], round) => {
  return fixturesList.filter((m) => m.week === round && m.matchState === 2);
};

export const getMatchLineup = (teamPlayers = []) => {
  const used = new Set();

  const pick = (positions, count) => {
    const result = teamPlayers
      .filter((p) => positions.includes(p.position) && !used.has(p.playerid))
      .sort((a, b) => b.power - a.power)
      .slice(0, count);
    result.forEach((p) => used.add(p.playerid));
    return result;
  };

  const DEF = ["Right-Back", "Centre-Back", "Left-Back"];
  const MID = ["Defensive Midfield", "Central Midfield", "Attacking Midfield"];
  const FWD = [
    "Right Winger",
    "Centre-Forward",
    "Left Winger",
    "Second Striker",
  ];

  const pickWithFallback = (primary, fallback, count) => {
    const result = pick([primary], count);
    if (result.length < count)
      result.push(...pick(fallback, count - result.length));
    return result;
  };

  return {
    goalkeeper: pick(["Goalkeeper"], 1),
    defenders: [
      ...pickWithFallback("Right-Back", DEF, 1),
      ...pickWithFallback("Centre-Back", DEF, 2),
      ...pickWithFallback("Left-Back", DEF, 1),
    ],
    midfielders: [
      ...pickWithFallback("Defensive Midfield", MID, 1),
      ...pickWithFallback("Central Midfield", MID, 1),
      ...pickWithFallback("Attacking Midfield", MID, 1),
    ],
    forwards: [
      ...pickWithFallback("Right Winger", FWD, 1),
      ...pickWithFallback("Centre-Forward", FWD, 1),
      ...pickWithFallback("Left Winger", FWD, 1),
    ],
  };
};

export const getTopScorer = (players = []) => {
  return [...players].sort((a, b) => b.goals - a.goals)[0];
};

export const getPlayedMatchweeks = (fixtures = []) => {
  const playedWeeks = new Set(
    fixtures.filter((f) => f.matchState === 2).map((f) => f.week),
  );
  return playedWeeks.size;
};

export const getNumberOfTeams = (standings = []) => standings.length;

export const getMostTeamScored = (standings = []) =>
  [...standings].sort((a, b) => b.goalsFor - a.goalsFor)[0];

export const getBestDefense = (standings = []) =>
  [...standings].sort((a, b) => a.goalsAgainst - b.goalsAgainst)[0];

export const getTeamsMovements = (standings = [], fixtures = []) => {
  const currentWeek = getCurrentMatchweek(fixtures)?.matchweek ?? 1;

  const prevWeekMatches = (fixtures || []).filter(
    (f) => f.week === currentWeek - 1 && f.matchState === 2,
  );

  const previousStandings = calculateStandingsFromMatches(prevWeekMatches);

  return standings.map((team) => {
    const prev = previousStandings.find((t) => t.team.id === team.team.id);

    const prevPos = prev?.position ?? team.position;

    return {
      team,
      change: prevPos - team.position,
    };
  });
};

export const getBiggestClimb = (standings = [], fixtures = []) => {
  const movements = getTeamsMovements(standings, fixtures);
  return [...movements].sort((a, b) => b.change - a.change)[0] ?? null;
};

export const getBiggestDrop = (standings = [], fixtures = []) => {
  const movements = getTeamsMovements(standings, fixtures);
  return [...movements].sort((a, b) => a.change - b.change)[0] ?? null;
};

export const getMostGoalConceded = (standings = []) =>
  [...standings].sort((a, b) => b.goalsAgainst - a.goalsAgainst)[0];

export const getHightGoalDifference = (standings = []) =>
  [...standings].sort((a, b) => b.goalDifference - a.goalDifference)[0];

export const getTeamStats = (fixtures = [], teamId) => {
  const homeMatches = fixtures.filter((f) => f.homeTeam === teamId);
  const awayMatches = fixtures.filter((f) => f.awayTeam === teamId);

  const homeWins = homeMatches.filter(
    (m) => m.homeTeamScore > m.awayTeamScore,
  ).length;
  const awayWins = awayMatches.filter(
    (m) => m.awayTeamScore > m.homeTeamScore,
  ).length;

  return {
    teamId,
    homeWins: homeWins,
    awayWins: awayWins,
  };
};

export const getBestHomeRecord = (standings = [], fixtures = []) => {
  const stats = standings
    .map((t) => getTeamStats(fixtures, t.team.id))
    .sort((a, b) => b.homeWins - a.homeWins)[0];

  if (!stats) return null;

  const standingEntry = standings.find((t) => t.team.id === stats.teamId);

  return {
    ...stats,
    team: standingEntry,
  };
};

export const getBestAwayRecord = (standings = [], fixtures = []) => {
  const stats = standings
    .map((t) => getTeamStats(fixtures, t.team.id))
    .sort((a, b) => b.awayWins - a.awayWins)[0];

  if (!stats) return null;

  const standingEntry = standings.find((t) => t.team.id === stats.teamId);

  return {
    ...stats,
    team: standingEntry,
  };
};

export const calculateStandingsFromMatches = (matches = []) => {
  const table = {};

  const initTeam = (id) => {
    if (!table[id]) {
      table[id] = {
        team: { id },
        points: 0,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
      };
    }

    return table[id];
  };

  matches.forEach((m) => {
    const hg = m.homeTeamScore ?? 0;
    const ag = m.awayTeamScore ?? 0;

    const home = initTeam(m.homeTeam);
    const away = initTeam(m.awayTeam);

    home.played++;
    away.played++;

    home.goalsFor += hg;
    home.goalsAgainst += ag;

    away.goalsFor += ag;
    away.goalsAgainst += hg;

    home.goalDifference = home.goalsFor - home.goalsAgainst;
    away.goalDifference = away.goalsFor - away.goalsAgainst;

    if (hg > ag) {
      home.won++;
      away.lost++;
    } else if (hg < ag) {
      away.won++;
      home.lost++;
    } else {
      home.drawn++;
      away.drawn++;
    }

    home.points = home.won * 3 + home.drawn;
    away.points = away.won * 3 + away.drawn;
  });

  return Object.values(table).sort((a, b) => b.points - a.points);
};

export const getStandingsByWeek = (fixtures = []) => {
  if (!Array.isArray(fixtures)) return {};
  const weeks = [...new Set(fixtures.map((f) => f.week))].sort((a, b) => a - b);

  const standingsByWeek = {};
  let currentMatches = [];

  weeks.forEach((week) => {
    const weekMatches = fixtures.filter(
      (f) => f.week === week && f.matchState === 2,
    );

    currentMatches = [...currentMatches, ...weekMatches];

    standingsByWeek[week] = calculateStandingsFromMatches(currentMatches);
  });

  return standingsByWeek;
};

export const getMaxRound = (fixtures = []) => {
  if (!fixtures.length) return 0;

  return Math.max(...fixtures.map((f) => f.week));
};

export const getTeamFromStandings = (standings = [], teamId) => {
  return standings.find((s) => s.team.id === teamId) ?? null;
};

export const getTeamHeadData = (rawTeam, standings = [], players = []) => {
  if (!rawTeam) return null;

  const standing = getTeamFromStandings(standings, rawTeam.id);

  return {
    name: rawTeam.name,
    logo: rawTeam.logo,
    coach: rawTeam.coach,
    stadium: rawTeam.stadium ?? "—",
    position: standing?.position ?? "—",
    points: standing?.points ?? "—",
    played: standing?.played ?? rawTeam.stats?.matchesPlayed ?? 0,
    wins: standing?.won ?? 0,
    draws: standing?.drawn ?? 0,
    losses: standing?.lost ?? 0,
    goalDiff: standing?.goalDifference ?? 0,
    marketValue: getMarketValue(players),
  };
};

export const getTeamPositon = (standings = [], teamId) => {
  return getTeamFromStandings(standings, teamId)?.position ?? null;
};

export const getTotalMatches = (teams = 18) => ((teams * (teams - 1)) / 2) * 2;
