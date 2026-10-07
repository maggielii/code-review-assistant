import { GoogleGenAI, Type } from "@google/genai";
import prisma from "../lib/prisma.js";

//const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
let ai;
function getAI() {
  if (!ai) {
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return ai;
}

const findingsSchema = {
    type: Type.OBJECT,
    properties: {
        findings: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    lineStart: { type: Type.INTEGER },
                    lineEnd: { type: Type.INTEGER },
                    severity: { type: Type.STRING },
                    message: { type: Type.STRING },
                    suggestion: { type: Type.STRING },
                },
                required: ["lineStart", "lineEnd", "severity", "message", "suggestion"],
            },
        },
    },
    required: ["findings"],
};

export function normalizeFindings(mode, findings) {
    if (mode !== "explain" || findings.length <= 1) {
      return findings;
    }
  
    return [
      {
        lineStart: findings[0].lineStart,
        lineEnd: findings[findings.length - 1].lineEnd,
        severity: "info",
        message: findings.map((f) => f.message).join("\n\n"),
        suggestion: findings.map((f) => f.suggestion).filter(Boolean).join(" "),
      },
    ];
  }

export async function analyzeCode(code, language, mode, lineStart, lineEnd, userNote) {
    const prompt = buildPrompt(code, language, mode, lineStart, lineEnd, userNote);
  
    let response;
    try {
        response = await getAI().models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: findingsSchema,
        },
      });
    } catch (error) {
      throw new Error("AI_REQUEST_FAILED");
    }
  
    let parsed;
    try {
      parsed = JSON.parse(response.text);
    } catch (error) {
      throw new Error("AI_RESPONSE_INVALID");
    }
  
    return normalizeFindings(mode, validateFindings(parsed));
  }

  const MODE_INSTRUCTIONS = {
    review: `Your task: find real problems in the selected code. Look for bugs, syntax errors, logic mistakes, and style issues. Do NOT explain working code and do NOT suggest rewrites of code that already works.
  For each finding, set severity to "error" (it breaks or will break), "warning" (risky or likely a bug), or "style" (readability or convention). Put what is wrong in "message" and the fix in "suggestion".
  If the code has no real problems, return an empty findings array. Do not invent issues.`,
  
    explain: `Your task: help the user understand the selected code. Do NOT look for bugs and do NOT criticize it.
  Return exactly ONE finding that covers the whole selected snippet: set lineStart to the first selected line and lineEnd to the last selected line.
  In "message", write one clear explanation for a beginner: first one sentence on what the code does overall, then walk through it step by step in the order it runs. Use short paragraphs separated by blank lines.
  In "suggestion", write one short sentence with the key takeaway.
  Set severity to "info".`,
  
    refactor: `Your task: suggest cleaner versions of the selected code, assuming it already works. Do NOT report bugs. Focus on readability, naming, duplication, simplicity, and idiomatic patterns.
  Set severity to "suggestion" for every finding. Put what could be improved and why in "message", and the improved code in "suggestion".
  If the code is already clean, return an empty findings array. Do not invent suggestions.`,
  };

  export function buildPrompt(code, language, mode, lineStart, lineEnd, userNote) {
    const lines = code.split("\n");
    const selectedSnippet = lines.slice(lineStart - 1, lineEnd).join("\n");
    const instructions = MODE_INSTRUCTIONS[mode] || MODE_INSTRUCTIONS.review;
  
    let noteSection = "";
    if (userNote) {
      noteSection = `The user added this note about what they want help with: "${userNote}"`;
    }
  
    return `You are a code assistant. The user selected lines ${lineStart}-${lineEnd} of the following ${language} code. Mode: ${mode}.
  
  ${instructions}
  
  ${noteSection}
  
  Full code:
  ${code}
  
  Selected snippet (lines ${lineStart}-${lineEnd}):
  ${selectedSnippet}
  
  Only report on the selected snippet, using the full code as context. Use line numbers that match the full code. Return findings as structured data.`;
  }
  
  export function validateFindings(parsed) {
    if (!parsed || !Array.isArray(parsed.findings)) {
      throw new Error("AI_RESPONSE_INVALID");
    }
    return parsed.findings;
  }

  export async function resolveFinding(findingId, userId) {
    const finding = await prisma.finding.findUnique({
      where: { id: findingId },
      include: { review: true },
    });
  
    if (!finding) {
      throw new Error("FINDING_NOT_FOUND");
    }
  
    if (finding.review.userId !== userId) {
      throw new Error("FORBIDDEN");
    }
  
    const updated = await prisma.finding.update({
      where: { id: findingId },
      data: { resolved: true },
    });
  
    return updated;
  }

  export async function getReviewsForUser(userId) {
    const reviews = await prisma.review.findMany({
      where: { userId: userId },
      include: { findings: true },
      orderBy: { createdAt: "desc" },
    });
  
    return reviews;
  }