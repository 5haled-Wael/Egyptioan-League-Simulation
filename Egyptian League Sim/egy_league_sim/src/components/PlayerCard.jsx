import "../styles/PlayerCard.css";
import {
  formatMarketValue,
  getPositionAbbr,
  getInitials,
} from "../utils/matchHelpers";

const getCardClass = (power) => {
  if (power >= 80) return "gold-card";
  if (power >= 70) return "silver-card";
  return "";
};

export default function PlayerCard({ player }) {
  return (
    <div className={`fifa-card ${getCardClass(player.power)}`}>
      <div className="card-glow"></div>
      <div className="card-top">
        <div>
          <div className="card-rating">{player.power}</div>
          <div className="card-pos-badge">
            {getPositionAbbr(player.position)}
          </div>
        </div>
        <div>
          <div className="card-nationality">{player.nationality}</div>
          <div className="card-value">
            {formatMarketValue(player.marketValue)}
          </div>
        </div>
      </div>
      <div className="card-avatar">
        {player.playerImage ? (
          <img src={player.playerImage} alt={player.name} />
        ) : (
          <span>{getInitials(player.name)}</span>
        )}
      </div>
      <div className="card-name">
        {player.name.split(" ").slice(0, 2).join(" ")}
      </div>
      <div className="card-divider"></div>
      <div className="card-stats">
        <div className="cstat">
          <span className="cstat-val">{player.goals ?? 0}</span>
          <span className="cstat-lbl">Goals</span>
        </div>
        <div className="cstat">
          <span className="cstat-val">{player.assists ?? 0}</span>
          <span className="cstat-lbl">Assists</span>
        </div>
        <div className="cstat">
          <span className="cstat-val">{player.shirtNumber ?? "—"}</span>
          <span className="cstat-lbl">Shirt</span>
        </div>
        <div className="cstat">
          <span className="cstat-val">{player.age}</span>
          <span className="cstat-lbl">Age</span>
        </div>
        <div className="cstat">
          <span className="cstat-val">{player.strongFoot?.[0] || "—"}</span>
          <span className="cstat-lbl">Foot</span>
        </div>
        <div className="cstat">
          <span className="cstat-val">{player.power}</span>
          <span className="cstat-lbl">Power</span>
        </div>
      </div>
    </div>
  );
}
