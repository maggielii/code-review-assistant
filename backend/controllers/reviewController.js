import { analyzeCode, resolveFinding } from "../services/reviewService.js";
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

export async function resolveFindingController(req, res) {
  const findingId = parseInt(req.params.id);

  try {
    const updated = await resolveFinding(findingId, req.userId);
    res.status(200).json(updated);
  } catch (error) {
    if (error.message === "FINDING_NOT_FOUND") {
      res.status(404).json({ error: "Finding not found." });
    } else if (error.message === "FORBIDDEN") {
      res.status(403).json({ error: "You don't have access to this finding." });
    } else {
      res.status(500).json({ error: "Something went wrong. Please try again." });
    }
  }
}