const BADGE_ICONS = {
  first_dream:  "★",
  second_dream: "✦",
  five_dreams:  "✸",
  ten_dreams:   "⬡",
};

export default function BadgeCard({ badge }) {
  return (
    <div className={`badge-card ${badge.earned ? "badge-earned" : "badge-locked"}`}>
      <div className="badge-circle">{BADGE_ICONS[badge.id] ?? "●"}</div>
      <p className="badge-label">{badge.label}</p>
    </div>
  );
}
