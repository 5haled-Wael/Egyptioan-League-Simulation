// COMPONENT
import Fixture from "./Fixture";
// UTILS
import { getRoundPlayedMatches } from "../utils/teamHelpers";

export default function Fixtures({ round, fixtures }) {
  const played = getRoundPlayedMatches(fixtures, round).length;

  return (
    <div className="container mt-3">
      {/* LABEL */}
      <div className="d-flex justify-content-between align-items-center">
        <h5>Round {round} Matches</h5>
        <p className="opacity-50">{played}/9 played</p>
      </div>

      {/* FIXTURES */}
      <div
        className="rounded-5 p-4"
        style={{ backgroundColor: "var(--color-background-secondary)" }}
      >
        <div className="row gx-5 gy-3">
          {fixtures.map((match) => (
            <div className="col-12 col-md-6 col-lg-4" key={match.id}>
              <Fixture fixtureData={match} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
