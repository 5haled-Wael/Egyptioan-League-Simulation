// STYLES
import "../styles/Hero.css";
// ROUTES
import { Link } from "react-router-dom";

export default function Hero({ simRef }) {
  return (
    <section className="hero">
      <div className="container-fluid overlay d-flex justify-content-center align-items-center flex-column">
        <h1 className="hero-heading">Data Meets Passion</h1>
        <p className="opacity-75">
          Track Standings. Analyze Performance. Simulate the Season.
        </p>
        <div className="d-flex gap-3">
          <button
            type="button"
            className="btn"
            onClick={() => {
              simRef.current?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Run Simulation
          </button>
          <Link to={`/standings`}>
            <button type="button" className="btn">
              Explore Standings
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
