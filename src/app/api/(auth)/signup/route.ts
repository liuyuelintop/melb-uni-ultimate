import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@shared/lib/db/mongoose";
import { optional, writeFailureResponse } from "@shared/lib/db/writes";
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

    const known = writeFailureResponse(error, "account");
    if (known) return known;

    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
