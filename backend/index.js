import express from "express";
import authRoutes from "./routes/authRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import cors from 'cors'

const app = express(); // the server
const PORT = 5050;

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json()); // middleware, express.json() parses text to JS object
app.use("/api/auth", authRoutes);
app.use("/api/reviews", reviewRoutes);

app.get("/", (req, res) => {
  res.send("OK");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});