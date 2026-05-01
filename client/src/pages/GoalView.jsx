import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import Navbar from "../components/Navbar";
import StepsList from "../components/StepsList";

function computeCountdown(targetDate) {
  if (!targetDate) return null;
  const now = new Date();
  const target = new Date(targetDate + "T00:00:00");
  if (target <= now) return null;

  let years = target.getFullYear() - now.getFullYear();
  let months = target.getMonth() - now.getMonth();
  if (months < 0) { years -= 1; months += 12; }

  const totalMonths = years * 12 + months;
  return { years, months, totalMonths };
}

export default function GoalView() {
  const { goalId } = useParams();
  const navigate = useNavigate();
  const [goal, setGoal] = useState(null);

  useEffect(() => {
    api.get(`/api/goals/${goalId}`).then(setGoal);
  }, [goalId]);

  async function markComplete() {
    await api.patch(`/api/goals/${goalId}/complete`);
    setGoal((g) => ({ ...g, completed: true }));
  }

  async function unmarkComplete() {
    await api.patch(`/api/goals/${goalId}/uncomplete`);
    setGoal((g) => ({ ...g, completed: false }));
  }

  async function deleteGoal() {
    if (!confirm("Delete this goal?")) return;
    await api.delete(`/api/goals/${goalId}`);
    navigate("/dashboard");
  }

  if (!goal) return <div className="loading">Loading...</div>;

  const completedSteps = goal.steps?.filter((s) => s.done).length ?? 0;
  const totalSteps = goal.steps?.length ?? 0;
  const progress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
  const addedLabel = goal.createdAt
    ? new Date(goal.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" }).toUpperCase()
    : "";
  const countdown = computeCountdown(goal.targetDate);
  const isSpotifyUrl = goal.spotifyUrl?.includes("open.spotify.com");
  const spotifyEmbedUrl = isSpotifyUrl
    ? goal.spotifyUrl.replace("open.spotify.com/", "open.spotify.com/embed/").split("?")[0]
    : null;

  return (
    <div className="page">
      <Navbar />
      <main className="goal-view">
        <div className="goal-view-left">
          {/* Dark green hero card */}
          <div className="goal-hero-card">
            <p className="goal-meta">
              {addedLabel && `//ADDED ${addedLabel}`}
              {goal.targetDate && ` · TARGET ${goal.targetDate}`}
            </p>
            <h1 className="goal-title">{goal.title}</h1>
            <div className="tag-row">
              {goal.tags?.map((t) => <span key={t} className="tag-hero">{t}</span>)}
            </div>
            <div className="goal-hero-watermark">01</div>
          </div>

          {/* About */}
          <div className="goal-content-card">
            <h3 className="section-label">ABOUT THIS DREAM</h3>
            <p className="about-text">{goal.notes || "No description added yet."}</p>
          </div>

          {/* Steps */}
          <div className="goal-content-card">
            <h3 className="section-label">STEPS</h3>
            <StepsList
              goalId={goalId}
              steps={goal.steps ?? []}
              onUpdate={(steps) => setGoal((g) => ({ ...g, steps }))}
            />
          </div>
        </div>

        <aside className="goal-sidebar">
          {/* Countdown */}
          <div className="sidebar-card">
            <p className="sidebar-label">// COUNTDOWN</p>
            {countdown ? (
              <>
                <div className="countdown-numbers">
                  <div className="countdown-col">
                    <span className="countdown-num">{countdown.years}</span>
                    <span className="countdown-unit">years</span>
                  </div>
                  <span className="countdown-sep">:</span>
                  <div className="countdown-col">
                    <span className="countdown-num">{countdown.months}</span>
                    <span className="countdown-unit">months</span>
                  </div>
                </div>
                <p className="countdown-total">
                  {countdown.totalMonths} month{countdown.totalMonths !== 1 ? "s" : ""} total
                </p>
              </>
            ) : (
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>
                {goal.targetDate ? "Past due" : "No target date"}
              </p>
            )}
          </div>

          {/* Photo */}
          {goal.imageUrl ? (
            <div style={{ borderRadius: "var(--r-card)", overflow: "hidden" }}>
              <img src={goal.imageUrl} alt={goal.title} className="goal-photo" />
            </div>
          ) : (
            <div className="photo-placeholder" onClick={() => navigate(`/goals/${goalId}/edit`)}>
              <span>▪</span>
              <span>//Add a photo</span>
            </div>
          )}

          {/* Spotify */}
          {goal.spotifyUrl && (
            <div className="spotify-sidebar-card">
              <p className="sidebar-label" style={{ color: "#aaa" }}>// SPOTIFY</p>
              {spotifyEmbedUrl ? (
                <iframe
                  src={spotifyEmbedUrl}
                  width="100%"
                  height="80"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  style={{ borderRadius: "8px" }}
                  title="Spotify"
                />
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                  <div className="spotify-preview-icon">♪</div>
                  <div>
                    <p className="spotify-preview-name">{goal.spotifyUrl}</p>
                    <p className="spotify-preview-sub">Your Spotify Pick</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Steps done */}
          <div className="sidebar-card sidebar-card--light">
            <p className="sidebar-label" style={{ color: "var(--text-muted)" }}>//STEPS DONE</p>
            <div className="steps-fraction">
              <span style={{ color: "var(--green-dark)" }}>{completedSteps}</span>
              <span className="steps-frac-total"> / {totalSteps}</span>
            </div>
            <div className="progress-bar progress-bar--light">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "var(--text-muted)" }}>
              {progress}% complete
            </p>
          </div>

          {/* Actions */}
          <div className="goal-actions">
            <button className="btn-secondary" onClick={() => navigate(`/goals/${goalId}/edit`)}>
              Edit Goal
            </button>
            {goal.completed ? (
              <button className="btn-secondary" onClick={unmarkComplete}>Unmark Complete</button>
            ) : (
              <button className="btn-primary" onClick={markComplete}>Mark Complete</button>
            )}
            <button className="btn-danger" onClick={deleteGoal}>Delete Goal</button>
          </div>
        </aside>
      </main>
    </div>
  );
}
