import { Router } from "express";
import { z } from "zod";
import { validate } from "../middleware/validate.js";
import { isDBConnected } from "../config/db.js";
import Feedback from "../models/Feedback.js";

const router = Router();

const schema = z.object({
  debateId: z.string().optional(),
  rating: z.number().min(1).max(5),
  comment: z.string().max(1000).default(""),
});

router.post("/", validate(schema), async (req, res, next) => {
  try {
    if (!isDBConnected()) return res.status(201).json({ saved: false, message: "Feedback received (stateless, DB not configured)" });
    const sessionId = req.header("X-Session-Id") || "anon";
    const doc = await Feedback.create({ ...req.body, sessionId });
    res.status(201).json(doc);
  } catch (e) { next(e); }
});

router.get("/stats", async (req, res, next) => {
  try {
    if (!isDBConnected()) return res.json({ count: 0, avgRating: null });
    const agg = await Feedback.aggregate([
      { $group: { _id: null, count: { $sum: 1 }, avgRating: { $avg: "$rating" } } },
    ]);
    res.json(agg[0] || { count: 0, avgRating: null });
  } catch (e) { next(e); }
});

export default router;
