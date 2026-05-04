// STYLES
import "../styles/MatchPage.css";
// ROUTES
import { useParams } from "react-router-dom";
// UTILS
import {
  getOrdinal,
  formatDate,
  positionShort,
  SECTIONS,
} from "../utils/matchHelpers";
// COMPONENTS
import Nav from "../components/Nav";
import Footer from "../components/Footer";
// ICONS
import { GiSoccerBall } from "react-icons/gi";
// HOOKS
import { useMatchPageData } from "../hooks/useMatchPageData";
import React from "react";

export default function MatchPage() {
  const { id } = useParams();

  const {
    fixture,
    home,
    away,
    isPlayed,
    homeLineup,
    awayLineup,
    navigate,
    stadium,
    homePosition,
    awayPosition,
  } = useMatchPageData(id);

  if (!fixture) {
    return (
      <div>
        <p>Match not found.</p>
        <button onClick={() => navigate(-1)}>← Go Back</button>
      </div>
    );
  }

  return (
    <>
      <Nav />

      <div className="mp-page">
        {/* HEADER */}
        <div className="mp-header">
          <span className="mp-competition">🏆 Egyptian Premier League</span>

          <div className="mp-meta-row">
            <span>📅 {formatDate(fixture.matchdate)}</span>
            <span className="mp-meta-dot">·</span>
            <span>📍 {stadium?.stadiumName || "Loading..."}</span>
            <span className="mp-meta-dot">·</span>
            <span>Matchweek {fixture.week}</span>
          </div>
        </div>

        {/* SCORE CARD */}
        <div className="mp-card">
          <span className={`mp-badge ${isPlayed ? "ft" : "up"}`}>
            {isPlayed ? "Full Time" : "Upcoming"}
          </span>

          <div className="mp-teams">
            {/* HOME */}
            <div
              className="mp-team"
              onClick={() => navigate(`/team/${home.id}`)}
            >
              <img src={home?.logo} alt={home?.name} className="mp-logo" />
              <span className="mp-team-name">{home?.name}</span>
              <span className="mp-team-pos">{getOrdinal(homePosition)}</span>
            </div>

            {/* SCORE */}
            <div className="mp-score">
              {isPlayed ? (
                <div className="mp-score-nums">
                  <span>{fixture.homeTeamScore}</span>
                  <span className="mp-score-dash">—</span>
                  <span>{fixture.awayTeamScore}</span>
                </div>
              ) : (
                <div className="mp-vs">VS</div>
              )}
            </div>

            {/* AWAY */}
            <div
              className="mp-team"
              onClick={() => navigate(`/team/${away.id}`)}
            >
              <img src={away?.logo} alt={away?.name} className="mp-logo" />
              <span className="mp-team-name">{away?.name}</span>
              <span className="mp-team-pos">{getOrdinal(awayPosition)}</span>
            </div>
          </div>
        </div>

        {/* LINEUPS */}
        <div className="mp-lineups">
          <h3 className="mp-lineups-title">Line-ups</h3>

          <div className="mp-grid">
            {/* HOME */}
            <div className="mp-col">
              <div
                className="mp-team-header"
                onClick={() => navigate(`/team/${home.id}`)}
              >
                <img
                  src={home?.logo}
                  alt={home?.name}
                  className="mp-team-logo"
                />
                <span>{home?.name}</span>
              </div>
              {homeLineup &&
                SECTIONS.map((section) => (
                  <React.Fragment key={section}>
                    {homeLineup[section].map((p) => (
                      <div className="mp-row" key={p.id}>
                        <span className="mp-shirt">#{p.shirtNumber}</span>
                        <span className="mp-pos">
                          {positionShort[p.position]}
                        </span>
                        <span className="mp-name">{p.name}</span>
                        {p.goals > 0 && (
                          <span className="mp-goals">
                            <GiSoccerBall /> {p.goals}
                          </span>
                        )}
                      </div>
                    ))}
                  </React.Fragment>
                ))}
            </div>

            <div className="mp-divider" />

            {/* AWAY */}
            <div className="mp-col">
              <div
                className="mp-team-header away"
                onClick={() => navigate(`/team/${away.id}`)}
              >
                <span>{away?.name}</span>
                <img
                  src={away?.logo}
                  alt={away?.name}
                  className="mp-team-logo"
                />
              </div>

              {awayLineup &&
                SECTIONS.map((section) => (
                  <React.Fragment key={section}>
                    {awayLineup[section]?.map((p) => (
                      <div className="mp-row away" key={p.id}>
                        {p.goals > 0 && (
                          <span className="mp-goals">
                            {p.goals} <GiSoccerBall />
                          </span>
                        )}
                        <span className="mp-name">{p.name}</span>
                        <span className="mp-pos">
                          {positionShort[p.position]}
                        </span>
                        <span className="mp-shirt">#{p.shirtNumber}</span>
                      </div>
                    ))}
                  </React.Fragment>
                ))}
            </div>
          </div>
        </div>

        <button className="mp-back" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>

      <Footer
        mainTxt={"Everything changes after this match"}
        btnTxt={"Go To Standings"}
      />
    </>
  );
}
