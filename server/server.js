import express from "express";
import cors from "cors";
import Groq from "groq-sdk";
import dotenv from "dotenv";
dotenv.config();

const app = express();

// 1. SECURITY: Restrict CORS to your frontend only
// If CLIENT_URL isn't set, it allows all (useful for local testing)
app.use(cors({
  origin: [
    "https://debate-gpt-six.vercel.app", // Your live Vercel frontend
    "http://localhost:5173",             // Local Vite dev port
    "http://localhost:3000"              // Alternative local port
  ],
  methods: ["GET", "POST"],
  credentials: true
}));
app.use(cors(corsOptions));
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post("/api/debate", async (req, res) => {
  try {
    const { messages, system } = req.body;

    // Optional: Add a quick validation check
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid messages format." });
    }

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
    
  } catch (error) {
    // 2. STABILITY: Prevent the server from crashing if Groq fails
    console.error("Groq API Error:", error);
    res.status(500).json({ error: "Failed to fetch response from AI." });
  }
});

// 3. DEPLOYMENT: Listen to the cloud provider's dynamic port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
