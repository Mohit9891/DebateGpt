import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { isDBConnected } from "../config/db.js";
import Debate from "../models/Debate.js";
import Message from "../models/Message.js";
import Feedback from "../models/Feedback.js";
import User from "../models/User.js";

const router = Router();

// LOGIN REQUIRED: personal analytics dashboard data
router.get("/", requireAuth, async (req, res, next) => {
  try {
    if (!isDBConnected()) return res.json({ debates: 0, messages: 0, avgRating: null, byPersonality: [] });
    const account = await User.findById(req.user.sub);
    const sessionIds = account?.sessionIds || [];
    const match = { $or: [{ userId: account?._id }, { sessionId: { $in: sessionIds } }] };

    const debates = await Debate.find(match);
    const debateIds = debates.map((d) => d._id);
    const messageCount = debateIds.length ? await Message.countDocuments({ debateId: { $in: debateIds } }) : 0;
    const feedbackAgg = await Feedback.aggregate([
      { $match: { sessionId: { $in: sessionIds } } },
      { $group: { _id: null, avgRating: { $avg: "$rating" }, count: { $sum: 1 } } },
    ]);
    const byPersonality = await Debate.aggregate([
      { $match: match },
      { $group: { _id: "$personalityId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.json({
      debates: debates.length,
      messages: messageCount,
      ended: debates.filter((d) => d.status === "ended").length,
      feedbackCount: feedbackAgg[0]?.count || 0,
      avgRating: feedbackAgg[0]?.avgRating ? Number(feedbackAgg[0].avgRating.toFixed(1)) : null,
      byPersonality,
      recent: debates.slice(0, 5).map((d) => ({ id: d._id, topic: d.topic, personalityId: d.personalityId, status: d.status, createdAt: d.createdAt })),
    });
  } catch (e) { next(e); }
});

export default router;
