import { test } from "node:test";
import assert from "node:assert";
import { buildPrompt, validateFindings } from "../services/reviewService.js";

test("buildPrompt includes the mode and language", () => {
    const prompt = buildPrompt("const x = 1;", "javascript", "review", 1, 1, "");
    assert.ok(prompt.includes("javascript"));
    assert.ok(prompt.includes("review"));
});

test("buildPrompt includes the user note when provided", () => {
    const prompt = buildPrompt("const x = 1;", "javascript", "review", 1, 1, "check performance");
    assert.ok(prompt.includes("check performance"));
});

test("buildPrompt omits the note section when no note given", () => {
    const prompt = buildPrompt("const x = 1;", "javascript", "review", 1, 1, "");
    assert.ok(!prompt.includes('The user added this note'));
});

test("buildPrompt gives different instructions for each mode", () => {
    const review = buildPrompt("x", "javascript", "review", 1, 1, "");
    const explain = buildPrompt("x", "javascript", "explain", 1, 1, "");
    const refactor = buildPrompt("x", "javascript", "refactor", 1, 1, "");
    assert.ok(review.includes("find real problems"));
    assert.ok(explain.includes("help the user understand"));
    assert.ok(refactor.includes("suggest cleaner versions"));
    assert.ok(!explain.includes("find real problems"));
});

test("buildPrompt falls back to review instructions for an unknown mode", () => {
    const prompt = buildPrompt("x", "javascript", "nonsense", 1, 1, "");
    assert.ok(prompt.includes("find real problems"));
});

test("validateFindings returns the findings array when valid", () => {
    const result = validateFindings({ findings: [{ message: "test" }] });
    assert.strictEqual(result.length, 1);
});

test("validateFindings throws when findings is missing", () => {
    assert.throws(() => {
        validateFindings({});
    }, /AI_RESPONSE_INVALID/);
});

test("validateFindings throws when findings is not an array", () => {
    assert.throws(() => {
        validateFindings({ findings: "not an array" });
    }, /AI_RESPONSE_INVALID/);
});

