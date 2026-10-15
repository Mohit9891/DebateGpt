let extractor = null;
let localFailed = false;

async function getExtractor() {
  if (extractor || localFailed) return extractor;
  try {
    const { pipeline } = await import("@xenova/transformers");
    console.log("[Embeddings] loading local model Xenova/all-MiniLM-L6-v384...");
    extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v384");
    console.log("[Embeddings] local model ready (384-dim, free, no API key)");
  } catch (err) {
    localFailed = true;
    console.warn("[Embeddings] local model unavailable, using offline hash fallback:", err.message?.slice(0, 120));
    extractor = null;
  }
  return extractor;
}

// Deterministic offline fallback: hashed bag-of-words, 384-dim, L2-normalized.
// Works with the same Atlas index; quality is keyword-level, fine for demo.
function hashEmbed(text) {
  const dims = 384;
  const vec = new Array(dims).fill(0);
  const words = text.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  for (const w of words) {
    let h1 = 0, h2 = 0;
    for (let i = 0; i < w.length; i++) {
      h1 = (h1 * 31 + w.charCodeAt(i)) >>> 0;
      h2 = (h2 * 37 + w.charCodeAt(i) * 7) >>> 0;
    }
    vec[h1 % dims] += 1;
    vec[h2 % dims] += 0.5;
  }
  // include bigrams for phrase match
  for (let i = 0; i < words.length - 1; i++) {
    const bg = words[i] + " " + words[i + 1];
    let h = 0;
    for (let j = 0; j < bg.length; j++) h = (h * 33 + bg.charCodeAt(j)) >>> 0;
    vec[h % dims] += 0.7;
  }
  const norm = Math.sqrt(vec.reduce((a, v) => a + v * v, 0)) || 1;
  return vec.map((v) => v / norm);
}

export async function embedTexts(texts) {
  if (!texts?.length) return [];
  const ext = await getExtractor();
  if (!ext) return texts.map((t) => hashEmbed(t.slice(0, 2000)));
  const results = [];
  for (const text of texts) {
    const out = await ext(text.slice(0, 2000), { pooling: "mean", normalize: true });
    results.push(Array.from(out.data));
  }
  return results;
}

export async function embedText(text) {
  const [embedding] = await embedTexts([text]);
  return embedding;
}

export const EMBEDDING_DIMS = 384;
