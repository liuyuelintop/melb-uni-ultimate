import { NextResponse } from "next/server";
import dbConnect from "@shared/lib/db/mongoose";
import { requireAuth } from "@shared/lib/auth/guards";
import User from "@shared/lib/db/models/user";

export async function POST() {
  try {
    const auth = await requireAuth();
    if (!auth.ok) return auth.response;

    await dbConnect();

    // Get fresh user data from database
    const user = await User.findOne({ email: auth.viewer.email }).select(
      "-password"
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return updated user data that should be used to refresh the session
    return NextResponse.json({
      message: "Session refresh data",
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
        studentId: user.studentId,
        position: user.position,
        experience: user.experience,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Error refreshing session:", error);
    return NextResponse.json(
      { error: "Failed to refresh session" },
      { status: 500 }
    );
  }
}
