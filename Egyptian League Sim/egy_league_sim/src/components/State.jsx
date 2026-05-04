import "../styles/TeamsStates.css";
import { Link } from "react-router-dom";

export default function State({
  title,
  name,
  value,
  unit,
  icon,
  variant,
  logo,
  teamId,
}) {
  const isPositive = variant === "positive";
  const isNegative = variant === "negative";

  return (
    <div className="state-card">
      <div
        className="state-icon-box"
        style={
          isPositive
            ? { background: "#0f6e2a" }
            : isNegative
              ? { background: "#7f1d1d" }
              : {}
        }
      >
        {icon}
      </div>
      <p className="state-title">{title}</p>

      {/* TEAM */}
      <Link to={`/team/${teamId}`}>
        <img src={logo} alt={title} className="state-logo" />
        <p className="state-team">{name}</p>
      </Link>

      <div className="state-value-row">
        <span
          className="state-value"
          style={
            isPositive
              ? { color: "#4ade80" }
              : isNegative
                ? { color: "#f87171" }
                : {}
          }
        >
          {value}
        </span>
        <span className="state-unit">{unit}</span>
      </div>
      {isPositive && (
        <span className="state-badge state-badge--positive">Rising</span>
      )}
      {isNegative && (
        <span className="state-badge state-badge--negative">Falling</span>
      )}
    </div>
  );
}
