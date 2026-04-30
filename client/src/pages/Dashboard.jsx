import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import Navbar from "../components/Navbar";
import GoalCard from "../components/GoalCard";
import StatsRow from "../components/StatsRow";
import CategoryFilter from "../components/CategoryFilter";

const CATEGORIES = ["Health", "Creative", "Travel", "Finance", "Fun", "Art"];

export default function Dashboard() {
  const [goals, setGoals] = useState([]);
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/api/goals").then(setGoals);
  }, []);

  const filtered = goals.filter((g) => {
    const matchSearch = g.title.toLowerCase().includes(search.toLowerCase());
    const matchTag = activeTag ? g.tags?.includes(activeTag) : true;
    return matchSearch && matchTag;
  });

  return (
    <div className="page">
      <Navbar />
      <main className="dashboard-main">
        <StatsRow goals={goals} />
        <div className="dashboard-controls">
          <input
            className="search-bar"
            placeholder="Search goals..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <CategoryFilter
            categories={CATEGORIES}
            active={activeTag}
            onSelect={(t) => setActiveTag(t === activeTag ? null : t)}
          />
          <button className="btn-add" onClick={() => navigate("/goals/new")}>
            + Add your dreams here
          </button>
        </div>
        <ul className="goal-list">
          {filtered.map((g) => (
            <GoalCard key={g.id} goal={g} onClick={() => navigate(`/goals/${g.id}`)} />
          ))}
        </ul>
      </main>
    </div>
  );
}
