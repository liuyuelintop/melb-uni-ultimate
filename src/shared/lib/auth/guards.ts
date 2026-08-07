import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "./options";
import dbConnect from "@shared/lib/db/mongoose";
import User from "@shared/lib/db/models/user";

export type Role = "user" | "admin";

/** The authenticated caller, with `role` read from the database. */
export type Viewer = {
  id: string;
  email: string;
  name: string;
  role: Role;
};

export type AuthResult =
  | { ok: true; viewer: Viewer }
  | { ok: false; response: NextResponse };

/**
 * Resolve the caller, or `null` if there isn't a usable one.
 *
 * Two deliberate choices:
 *
 * 1. `getServerSession` is always given `authOptions`. Called without them,
 *    NextAuth falls back to its default session callback and returns a session
 *    whose `user.role` is `undefined` — so a role check silently rejects
 *    everyone, admins included. TypeScript cannot catch the omission because
 *    the parameter is optional, so the only reliable fix is to have exactly one
 *    place that makes the call. This is that place.
 *
 * 2. `role` comes from the database, not from the JWT claim. The claim is
 *    written at sign-in and then fixed for the life of the token, so revoking
 *    an admin would not take effect until that token expired. Reading the
 *    current value costs one indexed lookup on an already-open connection, and
 *    means a demotion applies to the caller's very next request.
 *
 * A session whose user no longer exists in the database resolves to `null`, and
 * is reported to the caller as 401 rather than 404 — whether a given account
 * exists is not something an unauthenticated caller should be able to probe.
 */
export async function getViewer(): Promise<Viewer | null> {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) {
    return null;
  }

  await dbConnect();

  const user = (await User.findOne({ email })
    .select("name email role")
    .lean()) as {
    _id: unknown;
    name?: string;
    email?: string;
    role?: string;
  } | null;

  if (!user) {
    return null;
  }

  return {
    id: String(user._id),
    email: user.email ?? email,
    name: user.name ?? "",
    role: user.role === "admin" ? "admin" : "user",
  };
}

/** True when the caller is a verified admin. For read paths that vary output by role. */
export async function viewerIsAdmin(): Promise<boolean> {
  const viewer = await getViewer();
  return viewer?.role === "admin";
}

/**
 * Require any authenticated caller.
 *
 * ```ts
 * const auth = await requireAuth();
 * if (!auth.ok) return auth.response;
 * // auth.viewer is a Viewer from here on
 * ```
 */
export async function requireAuth(): Promise<AuthResult> {
  const viewer = await getViewer();

  if (!viewer) {
    return { ok: false, response: unauthorized() };
  }

  return { ok: true, viewer };
}

/** Require an admin caller. Same call shape as {@link requireAuth}. */
export async function requireAdmin(): Promise<AuthResult> {
  const viewer = await getViewer();

  if (!viewer) {
    return { ok: false, response: unauthorized() };
  }

  if (viewer.role !== "admin") {
    return { ok: false, response: forbidden() };
  }

  return { ok: true, viewer };
}

/** Display name for `createdBy` / `updatedBy` audit fields. */
export function attributionOf(viewer: Viewer): string {
  return viewer.name || viewer.email;
}

function unauthorized(): NextResponse {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function forbidden(): NextResponse {
  return NextResponse.json(
    { error: "Admin access required" },
    { status: 403 }
  );
}
