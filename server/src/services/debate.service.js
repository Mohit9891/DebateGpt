import Debate from "../models/Debate.js";
import Message from "../models/Message.js";
import { buildSystemPrompt } from "./prompt.service.js";
import { chatComplete } from "./groq.service.js";
import { isDBConnected } from "../config/db.js";

// Stateless fallback: still calls Groq without saving, so app works without MONGO_URI
export async function createDebate({ sessionId, userId = null, topic, openingArgument, stance, personalityId }) {
  const system = buildSystemPrompt({ topic, stance, personalityId });
  const reply = await chatComplete({ system, messages: [{ role: "user", content: openingArgument }] });

  if (!isDBConnected()) return { debateId: null, reply, persisted: false };

  const debate = await Debate.create({ sessionId, userId, topic, openingArgument, stance, personalityId });
  await Message.create({ debateId: debate._id, role: "user", content: openingArgument });
  await Message.create({ debateId: debate._id, role: "assistant", content: reply });
  return { debateId: debate._id, reply, persisted: true };
}

export async function addUserMessage({ debateId, content }) {
  const debate = await Debate.findById(debateId);
  if (!debate || debate.status !== "active") {
    const err = new Error("Debate not found or already ended");
    err.status = 404;
    throw err;
  }
  await Message.create({ debateId: debate._id, role: "user", content });
  const history = await Message.find({ debateId: debate._id }).sort({ createdAt: 1 }).limit(20);
  const system = buildSystemPrompt({ topic: debate.topic, stance: debate.stance, personalityId: debate.personalityId });
  const reply = await chatComplete({
    system,
    messages: history.map((m) => ({ role: m.role, content: m.content })),
  });
  await Message.create({ debateId: debate._id, role: "assistant", content: reply });
  return { reply };
}

export async function getDebateWithMessages(debateId) {
  const debate = await Debate.findById(debateId);
  if (!debate) {
    const err = new Error("Debate not found");
    err.status = 404;
    throw err;
  }
  const messages = await Message.find({ debateId: debate._id }).sort({ createdAt: 1 });
  return { debate, messages };
}
