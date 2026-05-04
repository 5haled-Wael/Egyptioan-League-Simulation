// STYLES
import "../styles/Simulation.css";
// ICONS
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";
import { TbPlayerTrackNextFilled } from "react-icons/tb";
import { FaBolt } from "react-icons/fa";
import { IoPlaySkipForwardSharp } from "react-icons/io5";
// HOOKS
import { useSimulationData } from "../hooks/useSimulatonData";
import { useSimulationFlow } from "../hooks/useSimulationFlow";
import { useEffect, useState } from "react";

export default function Simulation({ simRef }) {
  const [viewedWeek, setViewedWeek] = useState(null);
  const [simulationMessage, setSimulationMessage] = useState(null);

  const {
    currentMatchweek,
    totalMatchweeks,
    playedMatchweeks,
    progress,
    remainingMatchweeks,
  } = useSimulationData();

  const { handleNextWeek, handleNext5Weeks, handleEndSeason, isSimulating } =
    useSimulationFlow();

  const displayedWeek = viewedWeek ?? currentMatchweek.matchweek;

  const handleNavPrev = () => {
    setViewedWeek((prev) =>
      Math.max(1, (prev ?? currentMatchweek.matchweek) - 1),
    );
  };

  const handleNavNext = () => {
    setViewedWeek((prev) =>
      Math.min(totalMatchweeks, (prev ?? currentMatchweek.matchweek) + 1),
    );
  };

  const showSuccessMessage = (message) => {
    setSimulationMessage(message);
    setTimeout(() => setSimulationMessage(null), 3000);
    if (typeof toast === "function") toast.success(message);
  };

  const onNextWeek = async () => {
    const result = await handleNextWeek();
    if (result?.message) showSuccessMessage(result.message);
  };

  const onNext5Weeks = async () => {
    const result = await handleNext5Weeks();
    if (result?.message) showSuccessMessage(result.message);
  };

  const onEndSeason = async () => {
    const result = await handleEndSeason();
    if (result?.message) showSuccessMessage(result.message);
  };

  useEffect(() => {
    if (!isSimulating) setViewedWeek(null);
  }, [isSimulating, currentMatchweek.matchweek]);

  return (
    <div ref={simRef} className="container mt-3" id="simulation-section">
      <div className="position-relative overflow-hidden rounded-4 p-4 sim-page">
        {/* GLOW BLOBS  */}
        <div className="position-absolute rounded z-0 glow" />
        {/*== GLOW BLOBS  ==*/}

        <div className="position-relative z-1">
          {/* رسالة التنبيه */}
          {simulationMessage && (
            <div
              className="alert alert-success alert-dismissible fade show mb-3"
              role="alert"
            >
              {simulationMessage}
              <button
                type="button"
                className="btn-close"
                onClick={() => setSimulationMessage(null)}
              ></button>
            </div>
          )}

          {/* NAVIGATION */}
          <div className="d-flex justify-content-between align-items-center gap-3">
            <button
              type="button"
              className="btn btn-outline-secondary d-flex align-items-center justify-content-center p-2 navigation-btn"
              onClick={handleNavPrev}
              disabled={displayedWeek <= 1 || isSimulating}
            >
              <FaAngleLeft />
            </button>
            <div className="text-center">
              <h4 className="m-0 fs-2">Matchweek {displayedWeek}</h4>
              <p className="opacity-50 text-center m-0 date">
                {currentMatchweek?.dateRange?.from ? (
                  <>
                    {new Date(
                      currentMatchweek.dateRange.from,
                    ).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                    })}
                    {" - "}
                    {new Date(currentMatchweek.dateRange.to).toLocaleDateString(
                      "en-GB",
                      {
                        day: "numeric",
                        month: "short",
                      },
                    )}
                  </>
                ) : (
                  "Dates not available"
                )}
              </p>
            </div>
            <button
              type="button"
              className="btn btn-outline-secondary d-flex align-items-center justify-content-center p-2 navigation-btn"
              onClick={handleNavNext}
              disabled={displayedWeek >= totalMatchweeks || isSimulating}
            >
              <FaAngleRight />
            </button>
          </div>

          {/*== NAVIGATION ==*/}

          <div className="mt-3">
            {/* LABLE */}
            <div className="d-flex justify-content-between mb-1 lable">
              <span className="opacity-50">Season Progress</span>
              <span className="opacity-50">
                {playedMatchweeks} / {totalMatchweeks} weeks
              </span>
            </div>
            {/*== LABLE ==*/}

            {/* PROGRESS  BAR */}
            <div className="progress">
              <div
                className="progress-bar"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>
            {/*== PROGRESS  BAR ==*/}
          </div>

          {/* SIMULATION BUTTONS */}
          <div className="d-flex justify-content-center gap-2 mt-3 sim flex-column flex-md-row">
            <button
              type="button"
              className="rounded p-2 d-flex flex-column align-items-center gap-1 sim-btn"
              onClick={onNextWeek}
              disabled={remainingMatchweeks < 1 || isSimulating}
            >
              <TbPlayerTrackNextFilled
                className={`fs-3 ${isSimulating ? "opacity-50" : ""}`}
              />
              <p className="m-0 pt-1">
                {isSimulating ? "Simulating..." : "Next Week"}
              </p>
              <span className="opacity-50">
                {remainingMatchweeks < 1 ? "Season Ended" : "+1 Matchweek"}
              </span>
            </button>

            <button
              type="button"
              className="rounded p-2 d-flex flex-column align-items-center gap-1 sim-btn"
              onClick={onNext5Weeks}
              disabled={remainingMatchweeks < 5 || isSimulating}
            >
              <FaBolt className={`fs-3 ${isSimulating ? "opacity-50" : ""}`} />
              <p className="m-0 pt-1">
                {isSimulating ? "Simulating..." : "Next 5 Weeks"}
              </p>
              <span className="fast-text">
                {remainingMatchweeks < 5 && remainingMatchweeks > 0
                  ? `Only ${remainingMatchweeks} Weeks Left`
                  : remainingMatchweeks < 1
                    ? "Season Ended"
                    : "Fast Forward"}
              </span>
            </button>

            <button
              type="button"
              className="rounded p-2 d-flex flex-column align-items-center gap-1 sim-btn"
              onClick={onEndSeason}
              disabled={remainingMatchweeks < 1 || isSimulating}
            >
              <IoPlaySkipForwardSharp
                className={`fs-3 ${isSimulating ? "opacity-50" : ""}`}
              />
              <p className="m-0 pt-1">
                {isSimulating ? "Simulating..." : "End of Season"}
              </p>
              <span className="opacity-50">
                {remainingMatchweeks < 1
                  ? "Season Completed"
                  : `Skip ${remainingMatchweeks} Week${remainingMatchweeks > 1 ? "s" : ""}`}
              </span>
            </button>
          </div>

          {/* إضافة مؤشر التحميل */}
          {isSimulating && (
            <div className="text-center mt-3">
              <div className="spinner-border text-light" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2 opacity-50">
                Simulating matches, please wait...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
