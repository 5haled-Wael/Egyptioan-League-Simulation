// STYLES
import "../styles/Features.css";
// ROUTING
import { Link } from "react-router-dom";
// ICONS
import { FaCalendarAlt, FaChartLine, FaShieldAlt } from "react-icons/fa";
import { MdOutlineSportsSoccer } from "react-icons/md";
import { FaFire } from "react-icons/fa";
import { FaSquare } from "react-icons/fa";
import { FiX } from "react-icons/fi";
// UTILS
import { formatDate } from "../utils/matchHelpers";

// HOOKS
import { useFeatureData } from "../hooks/useFeatureData";

export default function Features() {
  const {
    isLoading,
    firstTeam,
    topScorer,
    seasonProg,
    numberOfMatchesPlayed,
    currentMatchweek,
    totalMatches,
  } = useFeatureData();

  if (isLoading) {
    return <div className="container mt-4">Loading...</div>;
  }

  return (
    <div className="container mt-4">
      <div className="row align-items-stretch">
        {/* LEAGUE LEADER */}
        <div className="col-sm-12 col-md-12 col-lg-4 mb-3 mb-md-3 mb-lg-0 d-flex">
          <Link to={`/team/${firstTeam?.id}`} className="w-100 d-flex">
            <div className="rounded-5 p-3 league-leader w-100 d-flex flex-column">
              <div className="rounded-5 p-4 text-center h-100 d-flex flex-column justify-content-between">
                <h4>League Leader</h4>

                <img
                  className="my-2"
                  src={firstTeam?.logo}
                  alt={firstTeam?.name}
                />

                <div className="fs-1">
                  {firstTeam?.points}
                  <span className="fs-4 opacity-50">pts</span>
                </div>

                <hr className="w-100" />

                <div className="row stats w-100">
                  <div className="col fs-4">
                    {firstTeam?.wins}
                    <span className="d-block opacity-50">W</span>
                  </div>
                  <div className="col fs-4">
                    {firstTeam?.draws}
                    <span className="d-block opacity-50">D</span>
                  </div>
                  <div className="col fs-4">
                    {firstTeam?.losses}
                    <span className="d-block opacity-50">L</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
        {/*== LEAGUE LEADER ==*/}
        {/* STATS */}
        <div className="col-sm-12 col-md-12 col-lg-8 d-flex flex-column">
          {/* TOP SCORER */}
          <div className="p-4 rounded-5 top-scorer">
            <h4>Top Scorer</h4>
            <div className="d-flex flex-wrap align-items-center gap-3 mt-3">
              <div className="d-flex gap-3 align-items-center">
                <img
                  src={topScorer?.playerImage}
                  alt={topScorer?.name}
                  className="rounded-2"
                />
                <div className="d-flex flex-column justify-content-center">
                  <p className="m-0 fs-2">{topScorer?.name}</p>
                  <span className="opacity-50">{topScorer?.position}</span>
                </div>
              </div>

              <div className="d-flex flex-grow-1 justify-content-around">
                <div className="p-3 d-flex flex-column justify-content-center align-items-center">
                  <p className="fs-1 m-0 goal-text">{topScorer?.goals}</p>
                  <span className="opacity-50">Goals</span>
                </div>
                <div className="vr align-self-stretch" />

                <div className="p-3 d-flex flex-column justify-content-center align-items-center">
                  <p className="m-0">{topScorer?.assists}</p>
                  <span className="opacity-50">Assists</span>
                </div>
                <div className="vr align-self-stretch" />

                <div className="p-3 d-flex flex-column justify-content-center align-items-center">
                  <p className="m-0">{topScorer?.yellowCards}</p>
                  <span className="opacity-50">yellow Cards</span>
                </div>
                <div className="vr align-self-stretch" />

                <div className="p-3 d-flex flex-column justify-content-center align-items-center">
                  <p className="m-0">{topScorer?.redCards}</p>
                  <span className="opacity-50">Red Cards</span>
                </div>
              </div>
            </div>
          </div>
          {/*== TOP SCORER ==*/}

          <div className="d-flex flex-wrap gap-3 mt-3 flex-grow-1 align-items-stretch">
            <div className="d-flex flex-column gap-3 stats-holder flex-grow-1">
              {/* SEASON PROGRESS */}
              <div className="px-3 rounded-5 season-progress">
                <h6 className="text-center mb-1 fs-5">Season Progress</h6>

                <p className="text-center opacity-50 mb-2 fs-6">
                  {numberOfMatchesPlayed} of {totalMatches} Matches Completed
                </p>

                <div className="progress">
                  <div
                    className="progress-bar fw-semibold"
                    role="progressbar"
                    style={{
                      width: `${seasonProg}%`,
                      minWidth: seasonProg > 0 ? "55px" : "0",
                      backgroundColor: "var(--color-highlight)",
                    }}
                  >
                    {seasonProg}%
                  </div>
                </div>
              </div>
              {/*== SEASON PROGRESS ==*/}
              {/* TEAMS COMPETING */}
              <div className="d-flex justify-content-evenly align-items-center rounded-5 p-3 team-competing">
                <div>
                  <span className="d-block text-center fs-1">18</span>
                  <span className="opacity-50 fs-15">Team Competing</span>
                </div>

                <div>
                  <span className="d-block text-center fs-1">34</span>
                  <span className="opacity-50 fs-15">Matchweeks</span>
                </div>

                <div>
                  <span className="d-block text-center fs-1">1</span>
                  <span className="opacity-50 fs-15">Champion</span>
                </div>
              </div>
              {/*== TEAMS COMPETING ==*/}
            </div>

            {/* MATCHWEEK */}
            <div className="rounded-5 p-3 matchweek">
              <h6 className="text-center mb-1 fs-5">
                Matchweek {currentMatchweek?.matchweek}
              </h6>
              <p className="text-center opacity-50 m-0">
                {currentMatchweek?.started
                  ? "Current Active Round"
                  : "Upcoming Round"}
              </p>

              <div className="mt-2 d-flex flex-column gap-2">
                <div className="d-flex align-items-center gap-2">
                  <FaCalendarAlt />
                  <span>
                    {formatDate(currentMatchweek?.dateRange?.from)}
                    {" - "}
                    {formatDate(currentMatchweek?.dateRange?.to)}
                  </span>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <MdOutlineSportsSoccer />
                  <span>{currentMatchweek?.matches} Matches</span>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <FaFire />
                  <span>{currentMatchweek?.goals} Goals</span>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <FaChartLine />
                  <span>{currentMatchweek?.avgGoals} Goals / Match</span>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <FaShieldAlt />
                  <span>{currentMatchweek?.cleanSheets} Clean Sheets</span>
                </div>
              </div>
            </div>
            {/*== MATCHWEEK ==*/}
          </div>
        </div>
        {/*== STATS ==*/}
      </div>
    </div>
  );
}
