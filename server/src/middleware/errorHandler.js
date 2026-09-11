export function notFound(req, res) {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
}
// eslint-disable-next-line
export function errorHandler(err, req, res, next) {
  console.error(`[${req.id ?? "-"}]`, err?.message || err);
  // Never leak raw provider JSON (e.g. Groq 404 blob) to the client
  if (err?.status === 429) return res.status(429).json({ error: "AI rate limit hit. Please wait and try again." });
  if (err?.status === 502) return res.status(502).json({ error: "AI model unavailable. Please try again in a moment." });
  res.status(err.status || 500).json({ error: err.message || "Internal server error" });
}