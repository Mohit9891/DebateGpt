import mongoose from "mongoose";

const debateSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    topic: { type: String, required: true, maxlength: 200 },
    openingArgument: { type: String, required: true, maxlength: 2000 },
    stance: { type: String, enum: ["for", "against"], required: true },
    personalityId: { type: String, required: true },
    status: { type: String, enum: ["active", "ended"], default: "active" },
  },
  { timestamps: true }
);

debateSchema.index({ sessionId: 1, createdAt: -1 });

export default mongoose.model("Debate", debateSchema);
