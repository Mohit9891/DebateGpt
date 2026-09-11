import mongoose from "mongoose";
import { env, hasDB } from "./env.js";

export async function connectDB() {
  if (!hasDB()) {
    console.warn("⚠️  MONGO_URI not set — running in stateless mode (no persistence). Add it to server/.env to enable DB.");
    return false;
  }
  try {
    await mongoose.connect(env.MONGO_URI, { serverSelectionTimeoutMS: 8000 });
    console.log("✅ MongoDB connected");
    return true;
  } catch (err) {
    console.error("❌ MongoDB failed:", err.message);
    console.warn("⚠️  Continuing stateless (no persistence). Fix MONGO_URI / Atlas IP allowlist to enable DB.");
    return false;
  }
}

export const isDBConnected = () => mongoose.connection.readyState === 1;
