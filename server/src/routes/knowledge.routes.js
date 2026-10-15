import express from "express";
import { z } from "zod";
import { Knowledge } from "../models/Knowledge.js";
import { ingestDocument, seedFromWikipedia, getKnowledgeStats } from "../services/knowledge.service.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

const ingestSchema = z.object({
  text: z.string().min(50),
  topic: z.string().min(1),
  domain: z.enum(["science", "law", "economics", "philosophy", "health", "general"]),
  source: z.string().min(1),
  sourceUrl: z.string().url(),
  personaRelevance: z.array(z.string()).optional(),
});

const seedSchema = z.object({
  topic: z.string().min(1),
  domain: z.enum(["science", "law", "economics", "philosophy", "health", "general"]),
  personaRelevance: z.array(z.string()).optional(),
});

router.post("/ingest", requireAuth, async (req, res, next) => {
  try {
    const data = ingestSchema.parse(req.body);
    const result = await ingestDocument(data);
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
});

router.post("/seed", requireAuth, async (req, res, next) => {
  try {
    const data = seedSchema.parse(req.body);
    const result = await seedFromWikipedia(data);
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
});

router.get("/stats", requireAuth, async (req, res, next) => {
  try {
    const stats = await getKnowledgeStats();
    res.json(stats);
  } catch (err) {
    next(err);
  }
});

export default router;