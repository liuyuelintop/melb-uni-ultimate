import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { discoverRouteFiles, repoRoot } from "./routes";

/**
 * Spreads of a request-derived object into a database write.
 *
 * This is a text check, not a type check, and it is deliberately narrow: it
 * looks for the exact shape the codebase actually had — `...body` and friends
 * inside a route handler. It cannot catch every way a raw payload might reach an
 * update, and is not meant to. It exists so the specific mistake that was fixed
 * cannot quietly return.
 */
const SPREAD_PATTERNS = [
  /\.\.\.body\b/,
  /\.\.\.data\b/,
  /\.\.\.payload\b/,
  /\.\.\.\(await\s+request\.json\(\)\)/,
];

describe("route handlers do not mass-assign the request body", () => {
  const files = discoverRouteFiles();

  it("found the route files", () => {
    expect(files.length).toBeGreaterThan(0);
  });

  it.each(files)("%s", (file) => {
    const source = readFileSync(join(repoRoot, file), "utf8");

    for (const pattern of SPREAD_PATTERNS) {
      expect(
        pattern.test(source),
        `${file} spreads a request-derived object into a write (matched ` +
          `${pattern}). Name the updatable fields explicitly instead, and pass ` +
          `them through buildUpdate() — that is what keeps createdBy, createdAt ` +
          `and _id out of reach.`
      ).toBe(false);
    }
  });
});
