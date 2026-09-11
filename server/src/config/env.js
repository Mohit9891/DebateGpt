import { z } from "zod";
import dotenv from "dotenv";
dotenv.config();

const schema = z.object({
  PORT: z.string().default("5000"),
  // Optional for local dev without Atlas — server runs stateless if empty
  MONGO_URI: z.string().optional().default(""),
  GROQ_API_KEY: z.string().min(5, "GROQ_API_KEY missing in server/.env"),
  GROQ_MODEL: z.string().default("openai/gpt-oss-120b"),
  GROQ_FALLBACK_MODEL: z.string().default("openai/gpt-oss-20b"),
  GOOGLE_CLIENT_ID: z.string().optional().default(""),
  JWT_SECRET: z.string().optional().default("dev-secret-change-me"),
  CLIENT_URL: z.string().default("http://localhost:5173"),
});

export const env = schema.parse(process.env);
export const hasDB = () => Boolean(env.MONGO_URI && env.MONGO_URI.length > 10);
