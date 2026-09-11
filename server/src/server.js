import app from "./app.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";

const PORT = Number(env.PORT) || 5000;
// Listen first so /api/health works even while Atlas is connecting
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
// Connect in background — failures fall back to stateless mode
connectDB();
