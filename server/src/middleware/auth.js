import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function signToken(user) {
  return jwt.sign({ sub: user._id.toString(), email: user.email }, env.JWT_SECRET, { expiresIn: "30d" });
}

// Optional: attaches req.user if a valid Bearer token is present, never rejects
export function optionalAuth(req, _res, next) {
  const header = req.header("Authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return next();
  try {
    req.user = jwt.verify(token, env.JWT_SECRET);
  } catch {
    // invalid/expired — treat as guest
  }
  next();
}

// Required: rejects guests with 401
export function requireAuth(req, res, next) {
  const header = req.header("Authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Login required", loginRequired: true });
  try {
    req.user = jwt.verify(token, env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Session expired. Please login again.", loginRequired: true });
  }
}
