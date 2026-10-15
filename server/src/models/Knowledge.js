import mongoose from "mongoose";

const knowledgeSchema = new mongoose.Schema(
  {
    chunk: {
      type: String,
      required: true,
      trim: true,
    },
    topic: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    domain: {
      type: String,
      required: true,
      enum: [
        "science",
        "law",
        "economics",
        "philosophy",
        "health",
        "general",
      ],
      index: true,
    },
    source: {
      type: String,
      required: true,
      trim: true,
    },
    sourceUrl: {
      type: String,
      required: true,
      trim: true,
    },
    embedding: {
      type: [Number],
      required: true,
      validate: {
        validator: (v) => Array.isArray(v) && v.length === 384,
        message: "Embedding must be a 384-dim vector (local all-MiniLM-L6-v384)",
      },
    },
    personaRelevance: {
      type: [String],
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

knowledgeSchema.index({ topic: 1, domain: 1 });
knowledgeSchema.index({ domain: 1, personaRelevance: 1 });

export const Knowledge = mongoose.model("Knowledge", knowledgeSchema);