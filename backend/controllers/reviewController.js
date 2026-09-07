import { analyzeCode } from "../services/reviewService.js";
import prisma from "../lib/prisma.js";

export async function createReview(req, res) {
  const code = req.body.code;
  const language = req.body.language;
  const mode = req.body.mode;
  const lineStart = req.body.lineStart;
  const lineEnd = req.body.lineEnd;
  const userNote = req.body.userNote;

  try {
    const findings = await analyzeCode(code, language, mode, lineStart, lineEnd, userNote);

    const review = await prisma.review.create({
      data: {
        code: code,
        language: language,
        mode: mode,
        userNote: userNote,
        userId: req.userId,
        findings: {
          create: findings,
        },
      },
      include: {
        findings: true,
      },
    });

    res.status(201).json(review);
  } catch (error) {
    if (error.message === "AI_REQUEST_FAILED") {
      res.status(502).json({ error: "Could not reach the AI service. Please try again." });
    } else if (error.message === "AI_RESPONSE_INVALID") {
      res.status(502).json({ error: "The AI returned an unexpected response. Please try again." });
    } else {
      res.status(500).json({ error: "Something went wrong. Please try again." });
    }
  }
}