import express from "express";
import cors from "cors";
import helmet from "helmet";
import pinoHttp from "pino-http";
import { env } from "./config/env.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import { generalLimiter } from "./middleware/rateLimit.js";
import debateRoutes from "./routes/debate.routes.js";
import feedbackRoutes from "./routes/feedback.routes.js";
import personalityRoutes from "./routes/personalities.routes.js";
import authRoutes from "./routes/auth.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";

const app = express();
app.use(helmet());
app.use(pinoHttp({ autoLogging: false }));
app.use(
  cors({
    origin: [env.CLIENT_URL, "http://localhost:5173", "http://localhost:3000", "https://debate-gpt-six.vercel.app"],
    methods: ["GET", "POST"],
  })
);
app.use(express.json({ limit: "20kb" }));
app.use(generalLimiter);

app.get("/", (req, res) => res.json({ name: "DebateGPT API", health: "/api/health" }));
app.get("/api/health", async (req, res) => {
  const { isDBConnected } = await import("./config/db.js");
  res.json({ ok: true, db: isDBConnected() ? "connected" : "stateless", time: new Date().toISOString() });
});

// New full-stack routes
app.use("/api/personalities", personalityRoutes);
app.use("/api/debates", debateRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/analytics", analyticsRoutes);

// Legacy single-shot route for the current frontend (POST /api/debate {messages, topic?, stance?, personalityId?})
app.use("/api/debate", debateRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
