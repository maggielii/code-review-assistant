import express from "express";
import authRoutes from "./routes/authRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import cors from 'cors'

console.log("Starting server...");
console.log("DATABASE_URL set:", !!process.env.DATABASE_URL);
console.log("JWT_SECRET set:", !!process.env.JWT_SECRET);
console.log("GEMINI_API_KEY set:", !!process.env.GEMINI_API_KEY);
console.log("PORT:", process.env.PORT);

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
});
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:", err);
});

const app = express(); // the server
const PORT = process.env.PORT || 5050;

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json()); // middleware, express.json() parses text to JS object
app.use("/api/auth", authRoutes);
app.use("/api/reviews", reviewRoutes);

app.get("/", (req, res) => {
  res.send("OK");
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });