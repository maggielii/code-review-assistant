import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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
    const lines = code.split("\n");
    const selectedSnippet = lines.slice(lineStart - 1, lineEnd).join("\n");

    let noteSection = "";
    if (userNote) {
        noteSection = `The user added this note about what they want help with: "${userNote}"`;
    }

    const prompt = 
    `You are a code review assistant. The user selected lines ${lineStart}-${lineEnd} of the following ${language} code and requested: ${mode}.

    ${noteSection}

    Full code:
    ${code}

    Selected snippet (lines ${lineStart}-${lineEnd}):
    ${selectedSnippet}

    Analyze only the selected snippet, using the full code as context. Return findings as structured data.`;

    let response;
    try {
    response = await ai.models.generateContent({
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

    if (!Array.isArray(parsed.findings)) {
        throw new Error("AI_RESPONSE_INVALID");
    }

    return parsed.findings;
  }