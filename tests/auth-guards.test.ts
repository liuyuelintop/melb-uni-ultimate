import { describe, expect, it, vi, beforeEach } from "vitest";
import { join } from "node:path";
import {
  discoverMutatingHandlers,
  isIntentionallyAnonymous,
  INTENTIONALLY_ANONYMOUS,
  repoRoot,
  type RouteHandler,
} from "./routes";

/**
 * No session. This is the whole point of the suite: `getServerSession` is the
 * only thing standing between an anonymous request and a mutating handler, and
 * `guards.ts` is the only module that calls it.
 */
const getServerSession = vi.hoisted(() => vi.fn(async () => null));
vi.mock("next-auth", () => ({ getServerSession }));

/**
 * Reaching the database is a failure, not a fixture.
 *
 * `getViewer()` returns null before it calls `dbConnect()` when there is no
 * session, so a correctly guarded handler never gets here. Throwing rather than
 * stubbing a connection means a handler that connects *before* it authorises
 * fails with this message instead of hanging for the driver's 30s server
 * selection timeout.
 */
vi.mock("@shared/lib/db/mongoose", () => ({
  default: vi.fn(async () => {
    throw new Error(
      "dbConnect() was called while resolving an anonymous request — " +
        "the handler reached the database before authorising."
    );
  }),
}));

const handlers = discoverMutatingHandlers();

/** Next 15 passes dynamic segments as a promise. Any id will do; we never reach it. */
function routeContext() {
  return { params: Promise.resolve({ id: "000000000000000000000000" }) };
}

async function callAnonymously(handler: RouteHandler): Promise<Response> {
  const mod = await import(
    /* @vite-ignore */ join(repoRoot, handler.file)
  );

  const fn = mod[handler.method];
  expect(
    fn,
    `${handler.file} does not export ${handler.method}`
  ).toBeTypeOf("function");

  const request = new Request(`http://localhost${handler.urlPath}`, {
    method: handler.method,
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ name: "anonymous write attempt" }),
  });

  return fn(request, routeContext());
}

beforeEach(() => {
  getServerSession.mockClear();
});

describe("mutating handlers reject anonymous callers", () => {
  const guarded = handlers.filter((h) => !isIntentionallyAnonymous(h));

  it("found the expected number of mutating handlers", () => {
    // 24 mutating handlers, 23 of which require a session. If this number moves,
    // a route was added or removed — check it is guarded, then update the count.
    expect(handlers).toHaveLength(24);
    expect(guarded).toHaveLength(23);
  });

  it.each(guarded.map((h) => [`${h.method} ${h.urlPath}`, h] as const))(
    "%s returns 401 or 403",
    async (_label, handler) => {
      const response = await callAnonymously(handler);

      expect(
        [401, 403],
        `${handler.method} ${handler.urlPath} (${handler.file}) answered ` +
          `${response.status} to an anonymous caller`
      ).toContain(response.status);
    }
  );

  it("consults the session for every guarded handler", async () => {
    // A handler could return 401 for the wrong reason — a thrown error caught
    // and reported as unauthorised, say. Checking that the session was actually
    // read distinguishes "refused because anonymous" from "refused by accident".
    for (const handler of guarded) {
      getServerSession.mockClear();
      await callAnonymously(handler);
      expect(
        getServerSession,
        `${handler.method} ${handler.urlPath} never called getServerSession`
      ).toHaveBeenCalled();
    }
  });
});

describe("the anonymous allowlist", () => {
  it("contains only signup", () => {
    expect(INTENTIONALLY_ANONYMOUS).toEqual([
      { urlPath: "/api/signup", method: "POST" },
    ]);
  });

  it("lists only handlers that exist", () => {
    for (const allowed of INTENTIONALLY_ANONYMOUS) {
      expect(
        handlers.some(
          (h) => h.urlPath === allowed.urlPath && h.method === allowed.method
        ),
        `${allowed.method} ${allowed.urlPath} is allowlisted but no longer exists`
      ).toBe(true);
    }
  });
});
