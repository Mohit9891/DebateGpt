import { Router } from "express";
import { z } from "zod";
import { validate } from "../middleware/validate.js";
import { aiLimiter } from "../middleware/rateLimit.js";
import { optionalAuth, requireAuth } from "../middleware/auth.js";
import { isDBConnected } from "../config/db.js";
import Debate from "../models/Debate.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import { createDebate, addUserMessage, getDebateWithMessages } from "../services/debate.service.js";
import { buildSummaryStats } from "../services/summary.service.js";
import { chatComplete } from "../services/groq.service.js";
import { buildSystemPrompt } from "../services/prompt.service.js";

const router = Router();

// Attach req.user when a Bearer token is present (public routes stay open for guests)
router.use(optionalAuth);

const createSchema = z.object({
  topic: z.string().min(5, "Topic min 5 chars").max(200),
  openingArgument: z.string().min(10, "Argument min 10 chars").max(2000),
  stance: z.enum(["for", "against"]),
  personalityId: z.string().min(2),
});

const messageSchema = z.object({
  content: z.string().min(1).max(2000),
});

// True if the debate belongs to the logged-in user (directly or via linked guest session)
async function ownsDebate(user, debate) {
  if (!user || !debate) return false;
  if (debate.userId && debate.userId.toString() === user.sub) return true;
  const account = await User.findById(user.sub);
  return Boolean(account && account.sessionIds.includes(debate.sessionId));
}

// PUBLIC: legacy stateless proxy (try-a-debate without login)
router.post("/", aiLimiter, async (req, res, next) => {
  try {
    const { messages, topic, stance, personalityId } = req.body;
    if (!messages || !Array.isArray(messages)) return res.status(400).json({ error: "Invalid messages format." });
    const system = buildSystemPrompt({
      topic: topic || "general debate",
      stance: stance === "against" ? "against" : "for",
      personalityId: personalityId || "philosopher",
    });
    const reply = await chatComplete({ system, messages });
    res.json({ reply });
  } catch (e) { next(e); }
});

// PUBLIC: create debate + first AI reply (stamps userId when logged in)
router.post("/create", validate(createSchema), async (req, res, next) => {
  try {
    const sessionId = req.header("X-Session-Id") || "anon";
    const result = await createDebate({ sessionId, userId: req.user?.sub || null, ...req.body });
    res.status(201).json(result);
  } catch (e) { next(e); }
});

// LOGIN REQUIRED: history shows only your debates
router.get("/", requireAuth, async (req, res, next) => {
  try {
    if (!isDBConnected()) return res.json([]);
    const account = await User.findById(req.user.sub);
    const sessionIds = account?.sessionIds || [];
    const debates = await Debate.find({
      $or: [{ userId: account?._id }, { sessionId: { $in: sessionIds } }],
    }).sort({ createdAt: -1 }).limit(30);
    res.json(debates);
  } catch (e) { next(e); }
});

// PUBLIC: fetch transcript (needed mid-debate); summary/export stay protected
router.get("/:id", async (req, res, next) => {
  try {
    if (!isDBConnected()) return res.status(503).json({ error: "DB not configured. Set MONGO_URI." });
    const data = await getDebateWithMessages(req.params.id);
    res.json(data);
  } catch (e) { next(e); }
});

// PUBLIC: continue debating without login
router.post("/:id/messages", aiLimiter, validate(messageSchema), async (req, res, next) => {
  try {
    if (!isDBConnected()) return res.status(503).json({ error: "DB not configured. Set MONGO_URI." });
    const result = await addUserMessage({ debateId: req.params.id, content: req.body.content });
    res.json(result);
  } catch (e) { next(e); }
});

// PUBLIC: ending just marks status; reading the summary requires login
router.post("/:id/end", async (req, res, next) => {
  try {
    if (!isDBConnected()) return res.json({ ended: true, persisted: false });
    const debate = await Debate.findById(req.params.id);
    if (!debate) return res.status(404).json({ error: "Debate not found" });
    debate.status = "ended";
    await debate.save();
    res.json({ ended: true });
  } catch (e) { next(e); }
});

// LOGIN REQUIRED: argument summary
router.get("/:id/summary", requireAuth, async (req, res, next) => {
  try {
    if (!isDBConnected()) return res.status(503).json({ error: "DB not configured. Set MONGO_URI." });
    const { debate, messages } = await getDebateWithMessages(req.params.id);
    if (!(await ownsDebate(req.user, debate))) return res.status(403).json({ error: "Not your debate.", loginRequired: true });
    res.json(buildSummaryStats({ debate, messages }));
  } catch (e) { next(e); }
});

// LOGIN REQUIRED: export download
router.get("/:id/export", requireAuth, async (req, res, next) => {
  try {
    if (!isDBConnected()) return res.status(503).json({ error: "DB not configured." });
    const { debate, messages } = await getDebateWithMessages(req.params.id);
    if (!(await ownsDebate(req.user, debate))) return res.status(403).json({ error: "Not your debate.", loginRequired: true });
    const lines = messages.map((m) => `[${m.createdAt.toISOString()}] ${m.role === "user" ? "You" : debate.personalityId}: ${m.content}`);
    const safe = (debate.topic || "debate").replace(/[^\w\- ]+/g, "").slice(0, 30) || "debate";
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="debate-${safe}.txt"`);
    res.send(`Topic: ${debate.topic}\nStance: ${debate.stance}\n\n${lines.join("\n\n")}`);
  } catch (e) { next(e); }
});

export default router;
