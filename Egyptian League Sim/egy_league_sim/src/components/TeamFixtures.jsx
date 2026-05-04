import Fixture from "./Fixture";
import "../styles/TeamPage.css";
import { useFixtureData } from "../hooks/useTeamFixturesData";

export default function TeamFixtures({ teamId }) {
  const { played, upcoming } = useFixtureData(teamId);

  return (
    <div className="team-fixtures mt-4">
      {upcoming.length > 0 && (
        <div className="mb-4">
          <p className="section-label">Upcoming</p>
          <div className="fixtures-grid">
            {upcoming.map((f) => (
              <Fixture key={f.id} fixtureData={f} />
            ))}
          </div>
        </div>
      )}

      {played.length > 0 && (
        <div>
          <p className="section-label">Results</p>
          <div className="fixtures-grid">
            {played
              .slice()
              .reverse()
              .map((f) => (
                <Fixture key={f.id} fixtureData={f} />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
