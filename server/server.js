import express from "express";
import cors from "cors";
import Groq from "groq-sdk";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post("/api/debate", async (req, res) => {
  const { messages, system } = req.body;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: system },
      ...messages,
    ],
    max_tokens: 1000,
  });

  const reply = response.choices[0]?.message?.content || "No response.";
  res.json({ reply });
});

app.listen(5000, () => console.log("✅ Server running on port 5000"));