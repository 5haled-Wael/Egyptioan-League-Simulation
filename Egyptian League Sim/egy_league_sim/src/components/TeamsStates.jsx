// STYLES
import "../styles/TeamsStates.css";
// COMPONENTS
import State from "./State";
// ICONS
import { MdOutlineSportsSoccer } from "react-icons/md";
import { IoShield } from "react-icons/io5";
import { FaLongArrowAltUp } from "react-icons/fa";
import { FaLongArrowAltDown } from "react-icons/fa";
import { IoIosWarning } from "react-icons/io";
import { FaPlusMinus } from "react-icons/fa6";
import { IoMdHome } from "react-icons/io";
import { IoIosAirplane } from "react-icons/io";
// HOOKS
import { useTeamStates } from "../hooks/useTeamStates";

export default function TeamsStates() {
  const data = useTeamStates();

  if (!data) {
    return <div>Loading...</div>;
  }

  const {
    mostGoals,
    bestDefense,
    biggestClimb,
    biggestDrop,
    mostGoalConceded,
    hightGoalDifference,
    bestHomeRecord,
    bestAwayRecord,
  } = data;

  const statesList = [
    {
      title: "Most Goals Scored",
      team: mostGoals?.team,
      value: mostGoals?.goalsFor,
      icon: <MdOutlineSportsSoccer />,
      logo: mostGoals?.team?.logo,
    },
    {
      title: "Best Defense",
      team: bestDefense?.team,
      value: bestDefense?.goalsAgainst,
      unit: "conceded",
      icon: <IoShield />,
      logo: bestDefense?.team?.logo,
    },
    {
      title: "Biggest Climb",
      team: biggestClimb?.team?.team,
      value: `+${biggestClimb?.change}`,
      unit: "positions",
      icon: <FaLongArrowAltUp />,
      variant: "positive",
      logo: biggestClimb?.team?.team?.logo,
    },
    {
      title: "Biggest Drop",
      team: biggestDrop?.team?.team,
      value: `+${biggestDrop?.change}`,
      unit: "positions",
      icon: <FaLongArrowAltDown />,
      variant: "negative",
      logo: biggestDrop?.team?.team?.logo,
    },
    {
      title: "Most Goals Conceded",
      team: mostGoalConceded?.team,
      value: mostGoalConceded?.goalsAgainst,
      unit: "goals",
      icon: <IoIosWarning />,
      variant: "negative",
      logo: mostGoalConceded?.team?.logo,
    },
    {
      title: "Highest Goal Difference",
      team: hightGoalDifference?.team,
      value: `+${hightGoalDifference?.goalDifference}`,
      unit: "GD",
      icon: <FaPlusMinus />,
      logo: hightGoalDifference?.team?.logo,
    },
    {
      title: "Best Home Record",
      team: bestHomeRecord?.team?.team,
      value: bestHomeRecord?.homeWins,
      unit: "wins",
      icon: <IoMdHome />,
      logo: bestHomeRecord?.team?.team?.logo,
    },
    {
      title: "Best Away Record",
      team: bestAwayRecord?.team?.team,
      value: bestAwayRecord?.awayWins,
      unit: "wins",
      icon: <IoIosAirplane />,
      logo: bestAwayRecord?.team?.team?.logo,
    },
  ];

  return (
    <div className="container text-center">
      <div className="row g-3">
        {statesList.map((state, i) => (
          <div className="col col-md-4 col-lg-3" key={i}>
            <State
              title={state.title}
              name={state.team?.name}
              teamId={state.team?.id}
              value={state.value}
              unit={state.unit}
              icon={state.icon}
              variant={state.variant}
              logo={state.logo}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
