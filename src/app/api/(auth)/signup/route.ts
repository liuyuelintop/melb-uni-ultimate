import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect, { DatabaseConfigError } from "@shared/lib/db/mongoose";
import User from "@shared/lib/db/models/user";

// Authorisation and database access make this route inherently per-request.
// Without this, `next build` may try to prerender it and execute the handler at
// build time — which reaches for a session and a database connection that do not
// exist during a build, and fails the build with "Failed to collect page data".
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const {
      name,
      email,
      password,
      studentId,
      gender,
      phoneNumber,
      position,
      experience,
    } = await request.json();

    // Validate required fields
    if (!name || !email || !password || !gender) {
      return NextResponse.json(
        { error: "Missing required fields: name, email, password, gender" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if user already exists (by email only)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user. Optional text fields are omitted rather than stored as an
    // empty string or null: a unique index counts every null as the same value,
    // so writing null for an absent student ID makes the second such signup
    // collide with the first.
    const user = new User({
      name,
      email,
      password: hashedPassword,
      gender,
      role: "user",
      isVerified: false,
      ...optional({ studentId, phoneNumber, position, experience }),
    });

    await user.save();

    // Return success (without password)
    const { password: _, ...userWithoutPassword } = user.toObject();

    return NextResponse.json(
      {
        message: "User created successfully",
        user: userWithoutPassword,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);

    // A misconfigured or unreachable database is an operator problem, not a
    // problem with the submitted form. Reporting both as "Failed to create user"
    // sent people looking at their input, and forced a trip through the
    // deployment's runtime logs to learn that a connection string was wrong.
    if (error instanceof DatabaseConfigError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }

    const duplicate = duplicateKey(error);
    if (duplicate) {
      // A collision on a value the form actually submitted is the caller's
      // problem. A collision on null means a unique index exists on a field this
      // signup left empty — every empty value counts as the same one — which is
      // a database configuration problem the caller cannot do anything about, so
      // say which index is responsible rather than blaming their input.
      if (duplicate.value === null || duplicate.value === undefined) {
        return NextResponse.json(
          {
            error:
              `A unique index on "${duplicate.field}" is rejecting this signup, ` +
              `because that field was left empty and another account already has ` +
              `it empty. A unique index treats every empty value as the same ` +
              `value. The schema does not ask for "${duplicate.field}" to be ` +
              `unique, so this index is likely left over from an earlier version ` +
              `of it — drop it, or recreate it as a partial index that skips ` +
              `documents where the field is absent.`,
          },
          { status: 503 }
        );
      }

      return NextResponse.json(
        { error: `An account with this ${duplicate.field} already exists.` },
        { status: 409 }
      );
    }

    if (isConnectionError(error)) {
      return NextResponse.json(
        {
          error:
            "Could not reach the database. If this persists, check that the " +
            "cluster is running and that the deployment is allowed to connect " +
            "to it.",
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}

/**
 * Keep only the fields that were actually supplied, trimming strings.
 *
 * Mongoose stores an empty string as an empty string and an explicit null as
 * null, and a unique index treats every null as one and the same value. Omitting
 * the key entirely leaves the field absent, which is both truthful and the only
 * form a sparse index will skip.
 */
function optional(fields: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(fields)) {
    if (value === undefined || value === null) continue;
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (!trimmed) continue;
      out[key] = trimmed;
      continue;
    }
    out[key] = value;
  }

  return out;
}

/**
 * The field and value behind a duplicate-key rejection (MongoDB error 11000),
 * or null if this is not one. `keyPattern` names the index's fields and
 * `keyValue` holds the values that collided.
 */
function duplicateKey(error: unknown): { field: string; value: unknown } | null {
  if (!(error instanceof Error)) return null;

  const e = error as Error & {
    code?: number;
    keyPattern?: Record<string, unknown>;
    keyValue?: Record<string, unknown>;
  };

  if (e.code !== 11000) return null;

  const field = e.keyPattern ? Object.keys(e.keyPattern)[0] : undefined;
  if (!field) return null;

  return { field, value: e.keyValue ? e.keyValue[field] : undefined };
}

/**
 * Connection-level failures, as opposed to a rejected document.
 *
 * A name check alone is not enough: a failed SRV lookup — the usual symptom of a
 * wrong or paused Atlas cluster — rejects with a **plain** `Error` whose message
 * is `querySrv ENOTFOUND ...`, while a refused socket rejects with
 * `MongooseServerSelectionError`. Both are checked, along with the DNS and
 * socket codes.
 *
 * `MongoServerError` is deliberately excluded: it means the server answered and
 * rejected the operation — a duplicate key, for instance — which is not a
 * connectivity problem and should not be reported as one.
 */
function isConnectionError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;

  if (error.name.startsWith("Mongo") && error.name !== "MongoServerError") {
    return true;
  }

  const code = (error as NodeJS.ErrnoException).code;
  if (
    code &&
    ["ENOTFOUND", "ECONNREFUSED", "ETIMEDOUT", "EAI_AGAIN", "ENETUNREACH"].includes(
      code
    )
  ) {
    return true;
  }

  return /querySrv|ENOTFOUND|ECONNREFUSED|ETIMEDOUT/.test(error.message);
}
