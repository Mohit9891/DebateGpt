import { PERSONALITIES } from "../config/personalities.js";

export function buildSystemPrompt({ topic, stance, personalityId, ragContext = [] }) {
  const p = PERSONALITIES.find((x) => x.id === personalityId);
  const base = p?.prompt ?? "You are an intelligent debater opposing the user.";
  const userSide = stance === "for" ? "IN FAVOR of" : "AGAINST";
  const aiSide = stance === "for" ? "AGAINST" : "IN FAVOR of";

  let prompt = `${base}\nDebate topic: "${topic}"\nUser is ${userSide} the topic. You must argue ${aiSide} "${topic}".`;

  if (ragContext.length) {
    prompt += "\nREFERENCE MATERIAL (use these facts in your arguments):\n";
    ragContext.forEach((ctx, i) => {
      prompt += `[${i + 1}] ${ctx.chunk.slice(0, 400)} — Source: ${ctx.source}\n`;
    });
  }

  prompt += "\nSTRICT RULES:\n- Max 3 sentences\n- Cite sources when using retrieved facts (e.g., 'According to WHO...')\n- Simple everyday English\n- One strong argument per reply\n- End with a sharp question.";

  return prompt;
}