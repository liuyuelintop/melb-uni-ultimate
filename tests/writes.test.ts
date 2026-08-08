import { describe, expect, it } from "vitest";
import {
  optional,
  duplicateKey,
  isConnectionError,
  writeFailureResponse,
} from "@shared/lib/db/writes";
import { DatabaseConfigError } from "@shared/lib/db/mongoose";

/**
 * Build the error the driver actually raises on a unique-index collision. The
 * shape matters — `writeFailureResponse` reads `keyPattern` and `keyValue`, and
 * a plainer stand-in would let a regression through.
 */
function duplicateKeyError(
  keyPattern: Record<string, number>,
  keyValue: Record<string, unknown>
): Error {
  return Object.assign(
    new Error("E11000 duplicate key error collection: frisbee-club.players"),
    { name: "MongoServerError", code: 11000, keyPattern, keyValue }
  );
}

describe("optional()", () => {
  it("omits values that were never supplied", () => {
    expect(optional({ a: undefined, b: null })).toEqual({});
  });

  it("omits empty and whitespace-only strings", () => {
    expect(optional({ studentId: "", phoneNumber: "   " })).toEqual({});
  });

  it("trims the values it keeps", () => {
    expect(optional({ studentId: "  s123  " })).toEqual({ studentId: "s123" });
  });

  it("keeps falsy values that are not empty", () => {
    // The bug this guards against is writing `if (!value) continue`, which would
    // silently discard a legitimate 0 or false along with the blanks.
    expect(optional({ jerseyNumber: 0, isActive: false })).toEqual({
      jerseyNumber: 0,
      isActive: false,
    });
  });

  it("keeps non-string values as they are", () => {
    const joined = new Date("2026-01-01");
    expect(optional({ joined, tags: ["a"] })).toEqual({ joined, tags: ["a"] });
  });

  it("omits rather than nulls, so a unique index sees an absent field", () => {
    // The distinction the whole helper exists for: a unique index treats every
    // null as the same value, so two documents that both left studentId empty
    // collide. An absent key does not.
    const doc = { name: "A", ...optional({ studentId: "" }) };
    expect("studentId" in doc).toBe(false);
  });
});

describe("duplicateKey()", () => {
  it("reads the field and value out of a real E11000", () => {
    expect(
      duplicateKey(duplicateKeyError({ email: 1 }, { email: "a@b.com" }))
    ).toEqual({ field: "email", value: "a@b.com" });
  });

  it("reports a null collision, which is the empty-field case", () => {
    expect(
      duplicateKey(duplicateKeyError({ studentId: 1 }, { studentId: null }))
    ).toEqual({ field: "studentId", value: null });
  });

  it("ignores errors that are not duplicate keys", () => {
    expect(duplicateKey(new Error("something else"))).toBeNull();
    expect(duplicateKey({ code: 11000 })).toBeNull();
    expect(duplicateKey(null)).toBeNull();
  });
});

describe("isConnectionError()", () => {
  it("recognises a refused socket", () => {
    const error = Object.assign(new Error("connect ECONNREFUSED"), {
      name: "MongooseServerSelectionError",
    });
    expect(isConnectionError(error)).toBe(true);
  });

  it("recognises a failed SRV lookup, which is only a plain Error", () => {
    expect(isConnectionError(new Error("querySrv ENOTFOUND _mongodb._tcp"))).toBe(
      true
    );
  });

  it("recognises errors carrying a socket errno", () => {
    expect(
      isConnectionError(Object.assign(new Error("nope"), { code: "ETIMEDOUT" }))
    ).toBe(true);
  });

  it("does not treat a rejected write as a connectivity problem", () => {
    // MongoServerError means the server answered and refused the operation.
    // Reporting that as "cannot reach the database" would misdirect the reader.
    expect(
      isConnectionError(duplicateKeyError({ email: 1 }, { email: "a@b.com" }))
    ).toBe(false);
  });

  it("ignores ordinary errors", () => {
    expect(isConnectionError(new Error("validation failed"))).toBe(false);
    expect(isConnectionError("ECONNREFUSED")).toBe(false);
  });
});

describe("writeFailureResponse()", () => {
  it("reports a misconfigured deployment as 503", async () => {
    const response = writeFailureResponse(
      new DatabaseConfigError("MONGODB_URI is not set.")
    );
    expect(response?.status).toBe(503);
    await expect(response?.json()).resolves.toMatchObject({
      error: expect.stringContaining("MONGODB_URI"),
    });
  });

  it("blames a collision the caller did submit on the caller, as 409", async () => {
    const response = writeFailureResponse(
      duplicateKeyError({ email: 1 }, { email: "a@b.com" }),
      "player"
    );
    expect(response?.status).toBe(409);
    await expect(response?.json()).resolves.toEqual({
      error: "A player with this email already exists.",
    });
  });

  it("blames a collision on an empty field on the index, as 503", async () => {
    // The caller supplied nothing for this field, so a 409 pointing at their
    // input would be wrong. This is the stale-index case.
    const response = writeFailureResponse(
      duplicateKeyError({ studentId: 1 }, { studentId: null })
    );
    expect(response?.status).toBe(503);
    const body = await response?.json();
    expect(body.error).toContain("studentId");
    expect(body.error).toContain("partial index");
  });

  it("reports an unreachable database as 503", async () => {
    const response = writeFailureResponse(
      Object.assign(new Error("connect ECONNREFUSED"), {
        name: "MongooseServerSelectionError",
      })
    );
    expect(response?.status).toBe(503);
  });

  it("returns null for causes it has nothing better to say about", () => {
    // The caller falls back to its own 500 rather than inventing a diagnosis.
    expect(writeFailureResponse(new Error("validation failed"))).toBeNull();
  });
});
