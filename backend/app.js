import "./diagnostics.js";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

const app = express();

const allowedOrigins = [
    "http://localhost:5173",
    process.env.FRONTEND_URL,
  ];
  
  app.use(cors({ origin: allowedOrigins }));
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/reviews", reviewRoutes);

app.get("/", (req, res) => {
  res.send("OK");
});

export default app;