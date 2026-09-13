import express from "express";
import { createReview, resolveFindingController } from "../controllers/reviewController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", requireAuth, createReview);
router.patch("/findings/:id", requireAuth, resolveFindingController);

export default router;