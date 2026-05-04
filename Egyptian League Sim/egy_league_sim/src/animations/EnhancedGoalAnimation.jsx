// GoalAnimation.jsx
import React, { useState, useEffect, useRef } from "react";

const GoalAnimation = () => {
  const [showGoalText, setShowGoalText] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [shakeNet, setShakeNet] = useState(false);
  const ballRef = useRef(null);
  const netRef = useRef(null);

  useEffect(() => {
    // بدء الأنيميشن تلقائياً بعد تحميل الصفحة
    const startAnimation = setTimeout(() => {
      ballRef.current?.classList.add("kick");

      // ظهور المؤثرات بعد وصول الكورة للمرمى
      setTimeout(() => {
        setShakeNet(true);
        setShowFlash(true);
        setShowGoalText(true);

        setTimeout(() => setShakeNet(false), 400);
        setTimeout(() => setShowFlash(false), 400);
        setTimeout(() => setShowGoalText(false), 1200);
      }, 1000);
    }, 500);

    return () => clearTimeout(startAnimation);
  }, []);

  return (
    <div className="pitch">
      <div className="penalty-area"></div>

      <div className="goal">
        <div className="goal-frame"></div>
        <div
          ref={netRef}
          className={`goal-net ${shakeNet ? "shake" : ""}`}
        ></div>
      </div>

      <div ref={ballRef} className="ball"></div>

      {showFlash && <div className="flash"></div>}

      <div className={`goal-text ${showGoalText ? "show" : ""}`}>GOAL</div>

      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        :root {
          --pitch-green: #1a5c2e;
          --pitch-light: #217c3a;
        }

        body {
          background: linear-gradient(135deg, #0a1f0e 0%, #0a2a12 100%);
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          font-family: "Segoe UI", "Poppins", system-ui, sans-serif;
        }

        .pitch {
          position: relative;
          width: 900px;
          height: 550px;
          background: repeating-linear-gradient(
            90deg,
            var(--pitch-green) 0px,
            var(--pitch-green) 40px,
            var(--pitch-light) 40px,
            var(--pitch-light) 80px
          );
          border-radius: 12px;
          box-shadow:
            0 25px 50px -12px rgba(0, 0, 0, 0.5),
            inset 0 1px 2px rgba(255, 255, 255, 0.1);
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        /* خط المنتصف */
        .pitch::before {
          content: "";
          position: absolute;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
          width: 100%;
          height: 2px;
          background: rgba(255, 255, 255, 0.25);
        }

        /* دائرة المركز */
        .pitch::after {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 140px;
          height: 140px;
          border: 2px solid rgba(255, 255, 255, 0.25);
          border-radius: 50%;
        }

        /* منطقة الجزاء */
        .penalty-area {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 180px;
          height: 280px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-right: none;
          border-radius: 8px 0 0 8px;
        }

        /* المرمى */
        .goal {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 80px;
          height: 120px;
          z-index: 5;
        }

        .goal-frame {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 4px solid #f0d48a;
          border-right: none;
          border-radius: 4px 0 0 4px;
          box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.2);
          background: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 12px,
            rgba(255, 255, 255, 0.06) 12px,
            rgba(255, 255, 255, 0.06) 24px
          );
        }

        /* الشبكة */
        .goal-net {
          position: absolute;
          width: 100%;
          height: 100%;
          background-image:
            linear-gradient(
              to right,
              rgba(255, 255, 255, 0.15) 1px,
              transparent 1px
            ),
            linear-gradient(
              to bottom,
              rgba(255, 255, 255, 0.15) 1px,
              transparent 1px
            );
          background-size: 10px 10px;
        }

        .goal-net.shake {
          animation: netShake 0.4s ease-out;
        }

        @keyframes netShake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(6px);
          }
          75% {
            transform: translateX(-4px);
          }
        }

        /* الكرة */
        .ball {
          position: absolute;
          left: 60px;
          top: 50%;
          transform: translateY(-50%);
          width: 26px;
          height: 26px;
          background: radial-gradient(circle at 35% 35%, #fff, #ddd);
          border-radius: 50%;
          box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
          z-index: 20;
        }

        /* تفاصيل الكرة */
        .ball::before {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 10px;
          height: 10px;
          background: #2c2c2c;
          border-radius: 50%;
        }

        .ball::after {
          content: "";
          position: absolute;
          top: 22%;
          left: 22%;
          width: 5px;
          height: 5px;
          background: #2c2c2c;
          border-radius: 50%;
          opacity: 0.5;
        }

        /* أنيميشن التسديد */
        .ball.kick {
          animation: shootGoal 1.2s cubic-bezier(0.2, 0.9, 0.4, 1.1) forwards;
        }

        @keyframes shootGoal {
          0% {
            left: 60px;
            transform: translateY(-50%) rotate(0deg);
          }
          20% {
            left: 180px;
            transform: translateY(calc(-50% - 20px)) rotate(100deg);
          }
          50% {
            left: 400px;
            transform: translateY(calc(-50% + 8px)) rotate(240deg);
          }
          75% {
            left: 620px;
            transform: translateY(calc(-50% - 5px)) rotate(360deg);
          }
          100% {
            left: 830px;
            transform: translateY(-50%) rotate(480deg);
          }
        }

        /* تأثير الفلاش */
        .flash {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.3) 0%,
            transparent 70%
          );
          animation: flash 0.4s ease-out;
          pointer-events: none;
          z-index: 30;
        }

        @keyframes flash {
          0% {
            opacity: 0;
          }
          30% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }

        /* نص GOAL */
        .goal-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 72px;
          font-weight: 800;
          letter-spacing: 8px;
          background: linear-gradient(135deg, #ff3a4d, #ff8c42);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          white-space: nowrap;
          z-index: 40;
          opacity: 0;
          font-family: "Segoe UI", "Poppins", sans-serif;
        }

        .goal-text.show {
          animation: goalAppear 0.8s cubic-bezier(0.34, 1.2, 0.64, 1) forwards;
        }

        @keyframes goalAppear {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.5);
            letter-spacing: 20px;
          }
          40% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.1);
          }
          70% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.9);
          }
        }
      `}</style>
    </div>
  );
};

export default GoalAnimation;
