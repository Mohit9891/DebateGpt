import { useState } from "react";

const BookIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const ChevronIcon = ({ up }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points={up ? "18 15 12 9 6 15" : "6 9 12 15 18 9"} />
  </svg>
);

export default function RAGBadge({ sources = [] }) {
  const [expanded, setExpanded] = useState(false);
  if (!sources?.length) return null;

  // Dedupe by URL so "Wikipedia, Wikipedia, Wikipedia" becomes one entry
  const seen = new Set();
  const unique = sources.filter((s) => {
    const key = s.sourceUrl || s.source;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  const names = [...new Set(unique.map((s) => s.source))].join(", ");
  const label = sources.length > unique.length
    ? `📚 Grounded in: ${names} (${sources.length} passages)`
    : `📚 Grounded in: ${names}`;

  return (
    <div className="rag-badge">
      <button
        className="rag-badge-trigger"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        type="button"
      >
        <BookIcon />
        <span>{label}</span>
        <ChevronIcon up={expanded} />
      </button>

      {expanded && (
        <div className="rag-badge-content">
          {unique.map((src, i) => (
            <div key={i} className="rag-source">
              <div className="rag-source-header">
                <strong>[{i + 1}] {src.source}</strong>
                {src.sourceUrl && (
                  <a href={src.sourceUrl} target="_blank" rel="noopener noreferrer" className="rag-source-link">
                    Open source ↗
                  </a>
                )}
              </div>
              <div className="rag-source-text">{src.chunk}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}