import { Knowledge } from "../models/Knowledge.js";
import { embedTexts } from "./embedding.service.js";

const MAX_WORDS = 400;
const OVERLAP_WORDS = 50;

export function chunkText(text, maxWords = MAX_WORDS, overlap = OVERLAP_WORDS) {
  const words = text.trim().split(/\s+/);
  if (words.length <= maxWords) return [text];

  const chunks = [];
  let start = 0;

  while (start < words.length) {
    const end = Math.min(start + maxWords, words.length);
    const chunk = words.slice(start, end).join(" ");
    chunks.push(chunk);

    if (end >= words.length) break;
    start = end - overlap;
  }

  return chunks;
}

export async function ingestDocument({ text, topic, domain, source, sourceUrl, personaRelevance = [] }) {
  const chunks = chunkText(text);
  const embeddings = await embedTexts(chunks);

  const docs = chunks.map((chunk, i) => ({
    chunk,
    topic,
    domain,
    source,
    sourceUrl,
    embedding: embeddings[i],
    personaRelevance,
  }));

  await Knowledge.insertMany(docs);
  return { chunks: chunks.length };
}

export async function seedFromWikipedia({ topic, domain, personaRelevance = [] }) {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Wikipedia fetch failed: ${response.status}`);

  const data = await response.json();
  const text = data.extract || data.description || "";
  if (!text) throw new Error("No extract found for topic");

  return ingestDocument({
    text,
    topic,
    domain,
    source: "Wikipedia",
    sourceUrl: data.content_urls?.desktop?.page || url,
    personaRelevance,
  });
}

export async function seedFromUrl({ url, domain, topic, personaRelevance = [] }) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`URL fetch failed: ${response.status}`);

  const html = await response.text();
  const text = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return ingestDocument({
    text,
    topic,
    domain,
    source: "Custom URL",
    sourceUrl: url,
    personaRelevance,
  });
}

export async function getKnowledgeStats() {
  const total = await Knowledge.countDocuments();
  const byDomain = await Knowledge.aggregate([
    { $group: { _id: "$domain", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
  return { total, byDomain };
}