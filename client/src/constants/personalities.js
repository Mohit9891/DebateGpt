// Single source of truth on the frontend (mirrors server/src/config/personalities.js)
// Preferred: fetch GET /api/personalities — this is the offline fallback.
export const PERSONALITIES = [
  { id: "lawyer", emoji: "⚖️", name: "Lawyer", description: "Argues with legal precision and structured logic" },
  { id: "doctor", emoji: "🩺", name: "Doctor", description: "Debates using clinical evidence and medical reasoning" },
  { id: "scientist", emoji: "🔬", name: "Scientist", description: "Relies on data, research, and empirical facts" },
  { id: "philosopher", emoji: "🧠", name: "Philosopher", description: "Questions assumptions with deep critical thinking" },
  { id: "economist", emoji: "📊", name: "Economist", description: "Frames every issue through economics and incentives" },
  { id: "journalist", emoji: "📰", name: "Journalist", description: "Probes with sharp questions and seeks the truth" },
];
