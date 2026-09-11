import Groq from "groq-sdk";
import { env } from "../config/env.js";

const groq = new Groq({ apiKey: env.GROQ_API_KEY });

function isModelNotFound(err) {
  const msg = `${err?.status ?? ""} ${err?.code ?? ""} ${err?.message ?? ""}`;
  return err?.status === 404 || /model_not_found|does not exist/i.test(msg);
}

async function tryModel(model, system, messages) {
  const response = await groq.chat.completions.create(
    {
      model,
      messages: [{ role: "system", content: system }, ...messages],
      max_tokens: 350,
      temperature: 0.7,
    },
    { timeout: 25000 }
  );
  return response.choices[0]?.message?.content?.trim() || "No response.";
}

export async function chatComplete({ system, messages }) {
  const primary = env.GROQ_MODEL;
  try {
    return await tryModel(primary, system, messages);
  } catch (err) {
    // One automatic fallback if Groq retired/renamed the primary model
    if (isModelNotFound(err) && env.GROQ_FALLBACK_MODEL && env.GROQ_FALLBACK_MODEL !== primary) {
      console.warn(`⚠️  Groq model "${primary}" unavailable, retrying with fallback "${env.GROQ_FALLBACK_MODEL}"`);
      try {
        return await tryModel(env.GROQ_FALLBACK_MODEL, system, messages);
      } catch (fallbackErr) {
        fallbackErr.status = 502;
        throw fallbackErr;
      }
    }
    // Normalize provider errors so the frontend never sees raw "404 {...}" JSON
    if (err?.status === 429) err.status = 429;
    else if (!err.status) err.status = 502;
    throw err;
  }
}
