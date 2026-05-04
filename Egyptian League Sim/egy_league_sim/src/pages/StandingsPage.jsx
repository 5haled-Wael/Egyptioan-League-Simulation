// COMPONENTS
import Footer from "../components/Footer";
import Nav from "../components/Nav";
import Standings from "../components/Standings";
import TeamsStates from "../components/TeamsStates";

export default function StandingsPage() {
  return (
    <>
      <Nav />
      <Standings All={true} />
      <TeamsStates />
      <Footer
        mainTxt="Think the table will change?"
        btnTxt="Simulate the next round"
      />
    </>
  );
}
