import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import Navbar from "../components/Navbar";
import StepsList from "../components/StepsList";

function computeCountdown(targetDate) {
  if (!targetDate) return null;
  const now = new Date();
  const target = new Date(targetDate);
  const diffMs = target - now;
  if (diffMs <= 0) return null;
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  return { days, weeks, months };
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
                  <span className="countdown-num">{countdown.days}</span>
                  <span className="countdown-sep">:</span>
                  <span className="countdown-num">{countdown.weeks}</span>
                  <span className="countdown-sep">:</span>
                  <span className="countdown-num">{countdown.months}</span>
                </div>
                <div className="countdown-labels">
                  <span>days</span><span>weeks</span><span>months</span>
                </div>
              </>
            ) : (
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>
                {goal.targetDate ?? "No target date"}
              </p>
            )}
          </div>

          {/* Photo placeholder */}
          <div className="photo-placeholder">
            <span>▪</span>
            <span>//Add a photo</span>
          </div>

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
            {!goal.completed && (
              <button className="btn-primary" onClick={markComplete}>Mark Complete</button>
            )}
            <button className="btn-danger" onClick={deleteGoal}>Delete Goal</button>
          </div>
        </aside>
      </main>
    </div>
  );
}
