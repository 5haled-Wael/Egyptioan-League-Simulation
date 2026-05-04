// COMPONENTS
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import RoundPagination from "../components/RoundPagination";
import Fixtures from "../components/Fixtures";
// HOOKS
import { useMatchsPageData } from "../hooks/useMatchsPageData";

export default function MatchsPage() {
  const { fixtures, round, maxRound, setRound } = useMatchsPageData();

  return (
    <>
      <Nav />
      <RoundPagination maxRound={maxRound} round={round} setRound={setRound} />
      <Fixtures fixtures={fixtures} round={round} />
      <Footer
        mainTxt={"The result changes everything"}
        btnTxt={"Simulate the next round"}
      />
    </>
  );
}
