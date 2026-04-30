export default function GoalCard({ goal, onClick }) {
  return (
    <li className={`goal-card ${goal.completed ? "goal-card--done" : ""}`} onClick={onClick}>
      <span className="goal-card-dot" />
      <span className="goal-card-title">{goal.title}</span>
      <span className="tag">{goal.tags?.[0] ?? ""}</span>
    </li>
  );
}
