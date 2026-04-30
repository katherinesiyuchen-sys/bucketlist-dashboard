export default function CategoryFilter({ categories, active, onSelect }) {
  return (
    <div className="category-filter">
      <span className="filter-label">// filter:</span>
      {categories.map((cat) => (
        <button
          key={cat}
          className={`tag ${active === cat ? "tag-active" : ""}`}
          onClick={() => onSelect(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
