// STYLES
import "../styles/MatchsPage.css";

export default function RoundPagination({ round, setRound, maxRound }) {
  return (
    <div className="container d-flex justify-content-center mt-4">
      <nav aria-label="Round navigation">
        <ul className="pagination">
          {/* Previous */}
          <li className={`page-item ${round === 1 ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => setRound(round - 1)}>
              &laquo;
            </button>
          </li>

          {/* Current Round */}
          <li className="page-item active">
            <span className="page-link">Round {round}</span>
          </li>

          {/* Next */}
          <li className={`page-item ${round === maxRound ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => setRound(round + 1)}>
              &raquo;
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
