import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import Navbar from "../components/Navbar";

const CATEGORIES = ["Health", "Creative", "Travel", "Finance", "Fun", "Art", "Adventure", "Food", "Learning", "Career", "Family", "Sports"];
const EMPTY = {
  title: "", targetDate: "", tags: [], notes: "",
  steps: [], location: "", imageUrl: "", spotifyUrl: "",
};

function parseDateParts(dateStr) {
  if (!dateStr) return { month: null, year: null };
  const d = new Date(dateStr + "T00:00:00");
  return {
    month: String(d.getMonth() + 1).padStart(2, "0"),
    year: d.getFullYear(),
  };
}

export default function GoalForm() {
  const { goalId } = useParams();
  const isEdit = Boolean(goalId);
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [newStep, setNewStep] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/api/goals/${goalId}`).then((data) => {
      setForm({
        title:      data.title      ?? "",
        targetDate: data.targetDate ?? "",
        tags:       data.tags       ?? [],
        notes:      data.notes      ?? "",
        steps:      data.steps      ?? [],
        location:   data.location   ?? "",
        imageUrl:   data.imageUrl   ?? "",
        spotifyUrl: data.spotifyUrl ?? "",
      });
    });
  }, [goalId, isEdit]);

  function toggleTag(tag) {
    setForm((f) => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter((t) => t !== tag) : [...f.tags, tag],
    }));
  }

  function addStep() {
    if (!newStep.trim()) return;
    setForm((f) => ({ ...f, steps: [...f.steps, { text: newStep.trim(), done: false }] }));
    setNewStep("");
  }

  function removeStep(i) {
    setForm((f) => ({ ...f, steps: f.steps.filter((_, idx) => idx !== i) }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (isEdit) {
      await api.patch(`/api/goals/${goalId}`, form);
    } else {
      await api.post("/api/goals", form);
    }
    navigate("/dashboard");
  }

  const { month, year } = parseDateParts(form.targetDate);

  return (
    <div className="page">
      <Navbar />
      <main className="goal-form-main">
        <h1 className="form-headline">{isEdit ? "EDIT YOUR DREAM" : "ADD YOUR DREAMS"}</h1>

        <form onSubmit={handleSubmit} className="goal-form">
          {/* Title — card rectangle with embedded label */}
          <div className="form-section">
            <label>//WHAT'S YOUR DREAM?</label>
            <input
              className="form-field-input"
              placeholder="e.g. Hike the Fire Trail"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              required
            />
          </div>

          {/* Two-column body */}
          <div className="form-grid">
            {/* ── Left column ── */}
            <div className="form-left">
              <div className="form-section">
                <label>Categories</label>
                <div className="tag-row">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      className={`tag ${form.tags.includes(cat) ? "tag-active" : ""}`}
                      onClick={() => toggleTag(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-section">
                <label>About</label>
                <textarea
                  placeholder="//tell us about your dream"
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                />
              </div>

              <div className="form-section">
                <label>Steps</label>
                <ul className="steps-edit-list">
                  {form.steps.map((s, i) => (
                    <li key={i}>
                      <span>{s.text}</span>
                      <button type="button" onClick={() => removeStep(i)}>✕</button>
                    </li>
                  ))}
                </ul>
                <div className="add-step-row">
                  <input
                    placeholder="Add a step"
                    value={newStep}
                    onChange={(e) => setNewStep(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addStep())}
                  />
                  <button type="button" className="btn-secondary" onClick={addStep}>+ Add a step</button>
                </div>
              </div>
            </div>

            {/* ── Right column ── */}
            <div className="form-right">
              {/* Target date — card with big display */}
              <div className="target-date-card">
                <p className="target-date-label">Target Date</p>
                {month ? (
                  <div className="target-date-display">
                    <span className="target-date-big">{month}</span>
                    <span className="target-date-sep">/</span>
                    <span className="target-date-big">{year}</span>
                  </div>
                ) : (
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.82rem", color: "var(--green-muted)" }}>
                    No date set
                  </p>
                )}
                <input
                  type="date"
                  className="target-date-input"
                  value={form.targetDate}
                  onChange={(e) => setForm((f) => ({ ...f, targetDate: e.target.value }))}
                />
              </div>

              {/* Spotify — card rectangle with label */}
              <div className="form-section">
                <label>Spotify Playlist</label>
                <input
                  className="form-field-input"
                  placeholder="Playlist name or URL"
                  value={form.spotifyUrl}
                  onChange={(e) => setForm((f) => ({ ...f, spotifyUrl: e.target.value }))}
                />
                {form.spotifyUrl && (
                  <div className="spotify-preview">
                    <div className="spotify-preview-icon">♪</div>
                    <div>
                      <p className="spotify-preview-name">{form.spotifyUrl}</p>
                      <p className="spotify-preview-sub">Your Spotify Pick</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Photo URL */}
              <div className="form-section">
                <label>Photo</label>
                <input
                  className="form-field-input"
                  placeholder="Paste an image URL"
                  value={form.imageUrl}
                  onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
                />
                {form.imageUrl && (
                  <img
                    src={form.imageUrl}
                    alt="Preview"
                    style={{ width: "100%", borderRadius: "8px", objectFit: "cover", maxHeight: "140px" }}
                  />
                )}
              </div>

              {/* Actions */}
              <div className="form-actions">
                <button type="submit" className="btn-primary">Save Goal</button>
                <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
