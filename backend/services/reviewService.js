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
  
    return validateFindings(parsed);
  }

  export function buildPrompt(code, language, mode, lineStart, lineEnd, userNote) {
    const lines = code.split("\n");
    const selectedSnippet = lines.slice(lineStart - 1, lineEnd).join("\n");
  
    let noteSection = "";
    if (userNote) {
      noteSection = `The user added this note about what they want help with: "${userNote}"`;
    }
  
    return `You are a code review assistant. The user selected lines ${lineStart}-${lineEnd} of the following ${language} code and requested: ${mode}.
  
    ${noteSection}
  
    Full code:
    ${code}
  
    Selected snippet (lines ${lineStart}-${lineEnd}):
    ${selectedSnippet}
  
    Analyze only the selected snippet, using the full code as context. Return findings as structured data.`;
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