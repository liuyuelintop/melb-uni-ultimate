import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@shared/lib/db/mongoose";
import User from "@shared/lib/db/models/user";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await dbConnect();

    // Get fresh user data from database
    const user = await User.findOne({ email: session.user.email }).select(
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
