import { useParams } from "react-router-dom";

import Nav from "../components/Nav";
import Footer from "../components/Footer";
import TeamHead from "../components/TeamHead";
import TeamFormExpanded from "../components/TeamFormExpanded";
import TopPlayers from "../components/TopPlayers";

import "../styles/TeamPage.css";
import { Link } from "react-router-dom";
import TeamFixtures from "../components/TeamFixtures";

export default function TeamPage() {
  const { id } = useParams();
  const teamId = parseInt(id);

  return (
    <>
      <Nav />
      <TeamHead teamId={teamId} />

      <div className="container mt-4">
        <h6 className="section-label">Team Matches</h6>
        <TeamFormExpanded teamId={teamId} />

        <div className="d-flex justify-content-between align-items-center players mt-4">
          <h6 className="section-label">Top Players</h6>
          <Link to={`/team/${teamId}/players`} className="m-0 opacity-50">
            View All
          </Link>
        </div>
        <TopPlayers teamId={teamId} />

        <TeamFixtures teamId={teamId} />
      </div>

      <Footer
        mainTxt="Every team has a story, This is theirs"
        btnTxt="View upcoming matches"
      />
    </>
  );
}
