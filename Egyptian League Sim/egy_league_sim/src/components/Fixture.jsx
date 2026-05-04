// STYLES
import "../styles/Fixture.css";
// ROUTES
import { Link } from "react-router-dom";
// ICONS
import { FaLocationDot } from "react-icons/fa6";
// HOOKS
import { useFixtureData } from "../hooks/useFixtureData";
// UTILS
import { formatMatchDate } from "../utils/matchHelpers";

export default function Fixture({ fixtureData }) {
  const { home, away, isFT, handleClick, stadium } =
    useFixtureData(fixtureData);

  // let homeScore = fixtureData.score.home;
  // let awayScore = fixtureData.score.away;

  // if (fixtureData) {
  //   homeScore = homeScore - 5;
  //   awayScore = awayScore - 5;

  //   if (homeScore < 0) homeScore = 0;
  //   if (awayScore < 0) awayScore = 0;
  // }

  return (
    <div className="match-card rounded-3 overflow-hidden" onClick={handleClick}>
      {/* Header */}
      <div className="match-header d-flex justify-content-between align-items-center px-3 py-2">
        <span className="match-date">
          {formatMatchDate(fixtureData.matchdate)}
        </span>
        <span
          className={`status-badge ${isFT ? "status-ft" : "status-upcoming"}`}
        >
          {isFT ? "FT" : "UP"}
        </span>
      </div>
      {/*== Header ==*/}

      {/* Body */}
      <div className="d-flex align-items-center justify-content-between p-3 gap-2">
        {/* Home Team */}
        <Link
          to={`/team/${home?.team?.id}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="d-flex flex-column align-items-center gap-2 team-col">
            <div className="team-logo-wrap rounded-circle d-flex align-items-center justify-content-center">
              <img src={home?.team?.logo} alt={home?.team?.name} />
            </div>
            <span className="team-name text-center">{home?.team?.name}</span>
          </div>
        </Link>
        {/*== Home Team ==*/}

        {/* Score */}
        <div className="d-flex flex-column align-items-center justify-content-center score-block">
          {isFT ? (
            <div className="score">
              {fixtureData.score.home}
              <span className="score-divider">–</span>
              {fixtureData.score.away}
            </div>
          ) : (
            <span className="score-vs">vs</span>
          )}
        </div>
        {/*== Score ==*/}

        {/* Away Team */}
        <Link
          to={`/team/${away?.team?.id}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="d-flex flex-column align-items-center gap-2 team-col">
            <div className="team-logo-wrap rounded-circle d-flex align-items-center justify-content-center">
              <img src={away?.team?.logo} alt={away?.team?.name} />
            </div>
            <span className="team-name text-center">{away?.team?.name}</span>
          </div>
        </Link>
        {/*== Away Team ==*/}
      </div>
      {/*== Body ==*/}

      {/* Footer */}
      <div className="match-footer d-flex align-items-center gap-1 px-3 py-2">
        <FaLocationDot />
        <span className="stadium-name">
          {stadium?.stadiumName || "Loading..."}
        </span>
      </div>
    </div>
  );
}
