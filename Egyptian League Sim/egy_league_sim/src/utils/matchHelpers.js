export const getOrdinal = (n) => {
  if (!n) return "";

  // const s = ["th", "st", "nd", "rd"];
  const v = n % 100;

  if (v >= 11 && v <= 13) return n + "th";

  switch (n % 10) {
    case 1:
      return n + "st";
    case 2:
      return n + "nd";
    case 3:
      return n + "rd";
    default:
      return n + "th";
  }
};

export const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

export const positionShort = {
  Goalkeeper: "GK",
  "Centre-Back": "CB",
  "Left-Back": "LB",
  "Right-Back": "RB",
  "Defensive Midfield": "DM",
  "Central Midfield": "CM",
  "Attacking Midfield": "AM",
  "Left Winger": "LW",
  "Right Winger": "RW",
  "Centre-Forward": "CF",
  "Second Striker": "SS",
};

export const SECTIONS = ["goalkeeper", "defenders", "midfielders", "forwards"];

export const getInitials = (name) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");

export const formatMarketValue = (value) => {
  if (!value || value === 0) return "—";
  if (value >= 1_000_000) return `€${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `€${(value / 1_000).toFixed(0)}K`;
  return `€${value}`;
};

export const formatMatchDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
};

export const getPositionAbbr = (position) => {
  const map = {
    Goalkeeper: "GK",
    Defender: "DEF",
    Midfielder: "MID",
    Forward: "FWD",
  };
  return map[position] || position;
};

export const getMatchesByWeek = (fixtures, week) => {
  return fixtures.filter((m) => m.week === week);
};
