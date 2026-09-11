import { PERSONALITIES } from "../config/personalities.js";

export function buildSystemPrompt({ topic, stance, personalityId }) {
  const p = PERSONALITIES.find(x => x.id === personalityId);
  const base = p?.prompt ?? "You are an intelligent debater opposing the user.";
  const userSide = stance === "for" ? "IN FAVOR of" : "AGAINST";
  const aiSide = stance === "for" ? "AGAINST" : "IN FAVOR of";
  return `${base}\nDebate topic: "${topic}"\nUser is ${userSide} the topic. You must argue ${aiSide} "${topic}".\nSTRICT RULES:\n- Max 3 sentences\n- Simple everyday English\n- One strong argument per reply\n- End with a sharp question.`;
}