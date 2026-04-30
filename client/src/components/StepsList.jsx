import { api } from "../lib/api";

export default function StepsList({ goalId, steps, onUpdate }) {
  async function toggleStep(index) {
    const updated = steps.map((s, i) => (i === index ? { ...s, done: !s.done } : s));
    await api.patch(`/api/goals/${goalId}`, { steps: updated });
    onUpdate(updated);
  }

  return (
    <ul className="steps-list">
      {steps.map((step, i) => (
        <li key={i} className={`step-item ${step.done ? "step-done" : ""}`}>
          <input type="checkbox" checked={step.done} onChange={() => toggleStep(i)} />
          <span>{step.text}</span>
        </li>
      ))}
    </ul>
  );
}
