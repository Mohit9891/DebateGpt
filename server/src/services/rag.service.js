import { Knowledge } from "../models/Knowledge.js";
import { embedText } from "./embedding.service.js";

const PERSONA_DOMAINS = {
  lawyer: ["law", "general"],
  doctor: ["health", "science"],
  scientist: ["science", "general"],
  philosopher: ["philosophy", "general"],
  economist: ["economics", "general"],
  journalist: ["general"],
};

function toSources(docs) {
  return docs.map((r) => ({
    chunk: r.chunk,
    source: r.source,
    sourceUrl: r.sourceUrl,
    score: r.score ?? 1,
  }));
}

const STOPWORDS = new Set([
  "the", "and", "for", "are", "but", "not", "you", "all", "can", "had", "her",
  "was", "one", "our", "out", "has", "have", "will", "would", "there", "their",
  "what", "about", "which", "when", "make", "like", "into", "than", "them",
  "then", "some", "could", "should", "shall", "with", "that", "this", "from",
  "they", "been", "were", "being", "also", "more", "very", "just", "over",
  "such", "only", "other", "again", "once", "here", "there", "when", "where",
  "why", "how", "because", "until", "while", "during", "before", "after",
]);

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function contentWords(text) {
  return (text || "")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 3 && !STOPWORDS.has(w));
}

async function keywordFallback({ topic, allowedDomains, topK }) {
  const words = [...new Set(contentWords(topic))].slice(0, 6);
  // No meaningful keywords → honest miss beats false citation
  if (!words.length) return [];

  const orClauses = words.map((w) => ({ chunk: new RegExp(`\\b${esc(w)}\\b`, "i") }));
  const findIn = async (domainFilter) => {
    const q = domainFilter ? { domain: { $in: domainFilter }, $or: orClauses } : { $or: orClauses };
    return Knowledge.find(q).limit(topK * 5).lean();
  };

  let candidates = await findIn(allowedDomains);
  if (!candidates.length) candidates = await findIn(null);

  // Score by number of distinct content words matched; require >= 2 (or >= 1 if topic has only 1)
  const minMatches = words.length >= 2 ? 2 : 1;
  const scored = candidates
    .map((d) => {
      const text = `${d.topic} ${d.chunk}`.toLowerCase();
      const hits = words.filter((w) => text.includes(w)).length;
      return { d, hits };
    })
    .filter((x) => x.hits >= minMatches)
    .sort((a, b) => b.hits - a.hits)
    .slice(0, topK)
    .map((x) => x.d);

  return toSources(scored);
}

export async function retrieveContext({ topic, personalityId, userMessage, topK = 3 }) {
  const allowedDomains = PERSONA_DOMAINS[personalityId] || ["general"];
  try {
    const query = `${topic}: ${userMessage}`.slice(0, 500);
    const queryEmbedding = await embedText(query);

    const results = await Knowledge.aggregate([
      {
        $vectorSearch: {
          index: "vector_index",
          path: "embedding",
          queryVector: queryEmbedding,
          numCandidates: topK * 10,
          limit: topK,
          filter: { domain: { $in: allowedDomains } },
        },
      },
      {
        $project: {
          chunk: 1,
          source: 1,
          sourceUrl: 1,
          score: { $meta: "vectorSearchScore" },
        },
      },
    ]);

    if (results.length) return toSources(results);
    console.warn("[RAG] vector returned 0, trying keyword fallback");
    return await keywordFallback({ topic, allowedDomains, topK });
  } catch (err) {
    console.warn("[RAG] Retrieval failed, trying keyword fallback:", err.message?.slice(0, 150));
    try {
      return await keywordFallback({ topic, allowedDomains, topK });
    } catch {
      return [];
    }
  }
}
