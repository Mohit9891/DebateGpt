import { Router } from "express";
import { z } from "zod";
import { OAuth2Client } from "google-auth-library";
import { env, hasDB } from "../config/env.js";
import { validate } from "../middleware/validate.js";
import { requireAuth } from "../middleware/auth.js";
import { signToken } from "../middleware/auth.js";
import User from "../models/User.js";
import Debate from "../models/Debate.js";
import Feedback from "../models/Feedback.js";

const router = Router();
const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);

const googleSchema = z.object({
  idToken: z.string().min(10, "Missing Google credential"),
  sessionId: z.string().optional(),
});

// POST /api/auth/google { idToken, sessionId? } -> { token, user }
router.post("/google", validate(googleSchema), async (req, res, next) => {
  try {
    if (!hasDB()) return res.status(503).json({ error: "DB not configured. Set MONGO_URI to enable login." });
    if (!env.GOOGLE_CLIENT_ID) return res.status(500).json({ error: "GOOGLE_CLIENT_ID not configured on server." });

    const ticket = await googleClient.verifyIdToken({ idToken: req.body.idToken, audience: env.GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    if (!payload?.sub || !payload?.email) return res.status(401).json({ error: "Invalid Google credential." });

    let user = await User.findOne({ googleId: payload.sub });
    if (!user) {
      user = await User.create({
        googleId: payload.sub,
        email: payload.email,
        name: payload.name || "",
        avatar: payload.picture || "",
        sessionIds: [],
      });
    } else {
      user.name = payload.name || user.name;
      user.avatar = payload.picture || user.avatar;
    }

    // Hybrid: link guest debates/feedback from this browser to the account
    const sessionId = req.body.sessionId || req.header("X-Session-Id");
    if (sessionId) {
      if (!user.sessionIds.includes(sessionId)) user.sessionIds.push(sessionId);
      await Debate.updateMany({ sessionId, userId: null }, { $set: { userId: user._id } });
      await user.save();
    } else {
      await user.save();
    }

    const token = signToken(user);
    res.json({ token, user: { id: user._id, email: user.email, name: user.name, avatar: user.avatar } });
  } catch (e) {
    if (/wrong recipient|invalid/i.test(e.message || "")) return res.status(401).json({ error: "Google sign-in failed. Check OAuth Client ID." });
    next(e);
  }
});

router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.sub);
    if (!user) return res.status(404).json({ error: "User not found" });
    const debateCount = await Debate.countDocuments({ $or: [{ userId: user._id }, { sessionId: { $in: user.sessionIds } }] });
    const feedbackCount = await Feedback.countDocuments({ sessionId: { $in: user.sessionIds } });
    res.json({ user: { id: user._id, email: user.email, name: user.name, avatar: user.avatar }, stats: { debateCount, feedbackCount } });
  } catch (e) { next(e); }
});

export default router;
