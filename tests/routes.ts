import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

/** Vitest runs with the project root as cwd (see vitest.config.mts). */
export const repoRoot = process.cwd();
const apiRoot = join(repoRoot, "src/app/api");

/** Methods that change state, and so must not be reachable anonymously. */
export const MUTATING_METHODS = ["POST", "PUT", "PATCH", "DELETE"] as const;
export type MutatingMethod = (typeof MUTATING_METHODS)[number];

export type RouteHandler = {
  /** Repo-relative path of the route file, e.g. `src/app/api/(public)/events/route.ts`. */
  file: string;
  /** The URL the file serves. Route groups in parentheses are stripped: they do not appear in the URL. */
  urlPath: string;
  method: MutatingMethod;
};

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return entry.name === "route.ts" ? [full] : [];
  });
}

/**
 * Derive the served URL from a route file's path.
 *
 * Segments wrapped in parentheses are Next.js route groups and are **removed**,
 * because they do not appear in the URL. Forgetting that is what left the admin
 * dashboard unguarded (the middleware matched `/admin`, which does not exist)
 * and what made signup post to `/api/auth/signup` when the handler answers at
 * `/api/signup`. The stripping here is deliberate, not incidental.
 */
function urlPathOf(absoluteFile: string): string {
  const rel = relative(join(repoRoot, "src/app"), absoluteFile);
  return (
    "/" +
    rel
      .replace(/\/route\.ts$/, "")
      .split("/")
      .filter((segment) => !/^\(.*\)$/.test(segment))
      .join("/")
  );
}

/** Every route file under src/app/api, repo-relative and sorted. */
export function discoverRouteFiles(): string[] {
  return walk(apiRoot)
    .sort()
    .map((file) => relative(repoRoot, file));
}

/**
 * Every mutating handler exported by every route file, found by reading the
 * filesystem rather than from a hand-maintained list — so a newly added route
 * is picked up automatically and has to be accounted for.
 */
export function discoverMutatingHandlers(): RouteHandler[] {
  return walk(apiRoot)
    .sort()
    .flatMap((file) => {
      const source = readFileSync(file, "utf8");
      return MUTATING_METHODS.filter((method) =>
        new RegExp(`export\\s+(async\\s+)?function\\s+${method}\\b`).test(source)
      ).map((method) => ({
        file: relative(repoRoot, file),
        urlPath: urlPathOf(file),
        method,
      }));
    });
}

/**
 * The one mutating endpoint that is intentionally reachable without a session.
 * Signup has to be, or nobody could ever create an account. New accounts get the
 * `user` role and there is no self-service route to `admin`.
 *
 * Anything else appearing here should be treated as a security change, not a
 * test fix.
 */
export const INTENTIONALLY_ANONYMOUS: ReadonlyArray<{
  urlPath: string;
  method: MutatingMethod;
}> = [{ urlPath: "/api/signup", method: "POST" }];

export function isIntentionallyAnonymous(handler: RouteHandler): boolean {
  return INTENTIONALLY_ANONYMOUS.some(
    (allowed) =>
      allowed.urlPath === handler.urlPath && allowed.method === handler.method
  );
}
