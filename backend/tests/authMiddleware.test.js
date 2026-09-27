import { test } from "node:test";
import assert from "node:assert";
import jwt from "jsonwebtoken";
import { requireAuth } from "../middleware/authMiddleware.js";

process.env.JWT_SECRET = "test-secret";

test("requireAuth calls next() and sets req.userId for a valid token", () => {
  const token = jwt.sign({ userId: 42 }, process.env.JWT_SECRET);
  const req = { headers: { authorization: `Bearer ${token}` } };
  const res = {};
  let nextCalled = false;

  requireAuth(req, res, () => { nextCalled = true; });

  assert.strictEqual(nextCalled, true);
  assert.strictEqual(req.userId, 42);
});

test("requireAuth rejects a request with no token", () => {
  const req = { headers: {} };
  let statusCode;
  const res = {
    status(code) { statusCode = code; return this; },
    json() { return this; },
  };

  requireAuth(req, res, () => {
    assert.fail("next() should not have been called");
  });

  assert.strictEqual(statusCode, 401);
});