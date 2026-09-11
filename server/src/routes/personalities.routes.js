import { Router } from "express";
import { PERSONALITIES } from "../config/personalities.js";

const router = Router();

// Public list — never leak full system prompts
router.get("/", (req, res) => {
  res.json(PERSONALITIES.map(({ id, emoji, name }) => ({ id, emoji, name })));
});

export default router;
