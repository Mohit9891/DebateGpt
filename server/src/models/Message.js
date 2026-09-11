import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    debateId: { type: mongoose.Schema.Types.ObjectId, ref: "Debate", required: true, index: true },
    role: { type: String, enum: ["user", "assistant"], required: true },
    content: { type: String, required: true, maxlength: 4000 },
  },
  { timestamps: true }
);

messageSchema.index({ debateId: 1, createdAt: 1 });

export default mongoose.model("Message", messageSchema);
