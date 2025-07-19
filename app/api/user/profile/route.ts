import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/db/mongoose";
import User from "@/lib/db/models/user";

// GET - Fetch user profile
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await dbConnect();

    const user = await User.findOne({ email: session.user.email }).select(
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
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

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
        email: { $ne: session.user.email },
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
      { email: session.user.email },
      {
        name,
        phoneNumber,
        position,
        experience,
        jerseyNumber,
        updatedBy: session.user.id || "unknown",
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
