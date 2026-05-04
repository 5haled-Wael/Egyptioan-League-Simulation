// COMPONENTS
import Nav from "../components/Nav";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Simulation from "../components/Simulation";
import Fixtures from "../components/Fixtures";
import Standings from "../components/Standings";
import Footer from "../components/Footer";
// ROUTES
import { useRef } from "react";
// HOOKS
import { useHomeData } from "../hooks/useHomeData";

export default function Home() {
  const simRef = useRef(null);
  const { fixtures, matchweek } = useHomeData();

  return (
    <>
      <Nav isHome={true} />
      <Hero simRef={simRef} />
      <Features />
      <Simulation simRef={simRef} />
      <Fixtures fixtures={fixtures} matchweek={matchweek} round={matchweek} />
      <Standings All={false} />
      <Footer mainTxt="Ready To Simulate Your Matches?" btnTxt="Simulate Now" />
    </>
  );
}
