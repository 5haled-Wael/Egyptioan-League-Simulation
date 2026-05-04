import "../styles/Game.css";
import Nav from "../components/Nav";
import { useRef, useState } from "react";
import { FaQ } from "react-icons/fa6";
import song from "../assets/Audio.mp3";

export default function Game() {
  const [started, setStarted] = useState(false);
  const audioRef = useRef(null);

  const handleStart = () => {
    setStarted(true);

    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play();
    }
  };

  return (
    <div className="d-flex flex-column game">
      <Nav />

      <audio ref={audioRef} loop>
        <source src={song} type="audio/mpeg" />
      </audio>

      {!started ? (
        <div className="intro-screen d-flex justify-content-center align-items-center flex-column">
          <h1>Ready To Play?</h1>
          <p>Use WASD to move, SPACE to shoot, Q to pass</p>

          <button className="btn btn-light px-4 py-2" onClick={handleStart}>
            Play Game
          </button>
        </div>
      ) : (
        <>
          <iframe
            src="/game/index.html"
            width="100%"
            height="600px"
            title="Game"
          />

          <div className="d-flex justify-content-evenly align-items-center controller pt-3">
            <div className="d-flex justify-content-center flex-column align-items-center">
              {/* WASD ICON */}
              <div className="wasd-icon">
                <div className="wasd-row">
                  <span>W</span>
                </div>
                <div className="wasd-row">
                  <span>A</span>
                  <span>S</span>
                  <span>D</span>
                </div>
              </div>
              <p>Move</p>
            </div>

            <div className="d-flex justify-content-center flex-column align-items-center">
              {/* SPACE ICON */}
              <div className="space-icon">
                <span>SPACE</span>
              </div>
              <p>Shot</p>
            </div>

            <div className="d-flex justify-content-center flex-column align-items-center">
              {/* SPACE ICON */}
              <div className="q-key">
                <FaQ />
              </div>
              <p>Pass</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
