import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@shared/lib/db/mongoose";
import { requireAuth } from "@shared/lib/auth/guards";
import User from "@shared/lib/db/models/user";

// Authorisation and database access make this route inherently per-request.
// Without this, `next build` may try to prerender it and execute the handler at
// build time — which reaches for a session and a database connection that do not
// exist during a build, and fails the build with "Failed to collect page data".
export const dynamic = "force-dynamic";

// GET - Fetch user profile
export async function GET() {
  try {
    const auth = await requireAuth();
    if (!auth.ok) return auth.response;

    await dbConnect();

    const user = await User.findOne({ email: auth.viewer.email }).select(
      "-password"
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        name: user.name,
        email: user.email,
        studentId: user.studentId,
        position: user.position,
        experience: user.experience,
        jerseyNumber: user.jerseyNumber,
        phoneNumber: user.phoneNumber,
        graduationYear: user.graduationYear,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

// PUT - Update user profile
export async function PUT(request: NextRequest) {
  try {
    const auth = await requireAuth();
    if (!auth.ok) return auth.response;

    const body = await request.json();
    const { name, phoneNumber, position, experience, jerseyNumber } = body;

    // Validate required fields
    if (!name || !position || !experience) {
      return NextResponse.json(
        { error: "Name, position, and experience are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if jersey number is being changed and if it conflicts
    if (jerseyNumber) {
      const existingJersey = await User.findOne({
        jerseyNumber,
        email: { $ne: auth.viewer.email },
      });
      if (existingJersey) {
        return NextResponse.json(
          { error: "Jersey number is already taken by another user" },
          { status: 409 }
        );
      }
    }

    // Update user profile
    const updatedUser = await User.findOneAndUpdate(
      { email: auth.viewer.email },
      {
        name,
        phoneNumber,
        position,
        experience,
        jerseyNumber,
        updatedBy: auth.viewer.id,
      },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Profile updated successfully",
      user: {
        name: updatedUser.name,
        email: updatedUser.email,
        studentId: updatedUser.studentId,
        position: updatedUser.position,
        experience: updatedUser.experience,
        jerseyNumber: updatedUser.jerseyNumber,
        phoneNumber: updatedUser.phoneNumber,
        graduationYear: updatedUser.graduationYear,
        role: updatedUser.role,
        isVerified: updatedUser.isVerified,
      },
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
