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

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      studentId,
      gender,
      phoneNumber,
      position,
      experience,
      role: "user",
      isVerified: false,
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
