import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { api } from "../lib/api";
import Navbar from "../components/Navbar";
import BadgeCard from "../components/BadgeCard";

export default function Achievements() {
  const [badgeData, setBadgeData] = useState(null);
  const [goals, setGoals] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    Promise.all([
      api.get("/api/badges"),
      api.get("/api/goals"),
    ]).then(([badges, allGoals]) => {
      setBadgeData(badges);
      setGoals(allGoals);
    });
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    Promise.all([
      api.get("/api/badges"),
      api.get("/api/goals"),
    ])
      .then(([badges, allGoals]) => {
        setBadgeData(badges);
        setGoals(allGoals);
      })
      .catch((err) => {
        console.error("Failed to load achievements:", err);
        setBadgeData({ badges: [], completedCount: 0 }); // unblock the loading state
      });
  }, []);

  if (!badgeData) return <div className="loading">Loading...</div>;

  const displayName = user?.user_metadata?.display_name ?? user?.email?.split("@")[0] ?? "";
  const initials = displayName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  const earned = badgeData.badges.filter((b) => b.earned);
  const completedGoals = goals.filter((g) => g.completed);
  const incompleteGoals = goals.filter((g) => !g.completed);
  const percentLeft = goals.length > 0
    ? Math.round((incompleteGoals.length / goals.length) * 100)
    : 0;

  return (
    <div className="page">
      <Navbar />
      <main className="achievements-main">
        {/* Hero */}
        <div className="achievements-hero">
          <div className="avatar-initials">{initials || "?"}</div>
          <div>
            <h1 className="achievements-name">{displayName.toUpperCase()}</h1>
            <p className="achievements-meta">
              // {badgeData.completedCount} dreams completed · {earned.length} total badges
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="achievements-stats">
          <div className="stat-box">
            <span>{goals.length}</span>
            <p>Total Goals</p>
          </div>
          <div className="stat-box">
            <span>{earned.length}</span>
            <p>Total Badges</p>
          </div>
          <div className="stat-box">
            <span>{badgeData.completedCount}</span>
            <p>Dreams Done</p>
          </div>
          <div className="stat-box">
            <span>{percentLeft}%</span>
            <p>Dreams Left</p>
          </div>
        </div>

        {/* Badges + Completed Dreams */}
        <div className="achievements-panels">
          <div className="panel-card">
            <h2 className="panel-title">Badges</h2>
            <div className="badges-grid">
              {badgeData.badges.map((badge) => (
                <BadgeCard key={badge.id} badge={badge} />
              ))}
            </div>
          </div>

          <div className="panel-card">
            <h2 className="panel-title">Completed Dreams</h2>
            {completedGoals.length === 0 ? (
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                No completed dreams yet — go chase some!
              </p>
            ) : (
              <ul className="completed-list">
                {completedGoals.map((g) => (
                  <li key={g.id} className="completed-item">
                    <div className="completed-dot" />
                    <span className="completed-title">{g.title}</span>
                    <span className="completed-date">
                      {g.completedAt
                        ? new Date(g.completedAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })
                        : ""}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
