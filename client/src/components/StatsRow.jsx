export default function StatsRow({ goals }) {
  const total = goals.length;
  const completed = goals.filter((g) => g.completed).length;
  const inProgress = goals.filter((g) => !g.completed).length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="stats-row">
      <div className="stat-card">
        <span className="stat-number">{total}</span>
        <p>Total Goals</p>
      </div>
      <div className="stat-card">
        <span className="stat-number">{completed}</span>
        <p>Completed</p>
      </div>
      <div className="stat-card">
        <span className="stat-number">{inProgress}</span>
        <p>In Progress</p>
      </div>
      <div className="stat-card">
        <span className="stat-number">{percent}%</span>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${percent}%` }} />
        </div>
      </div>
    </div>
  );
}
