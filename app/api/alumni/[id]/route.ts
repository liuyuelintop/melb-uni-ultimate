import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/db/mongoose";
import Alumni from "@/lib/db/models/alumni";
import User from "@/lib/db/models/user";

// PUT - Update alumni
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    const { id } = await params;

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      email,
      studentId,
      graduationYear,
      currentLocation,
      currentJob,
      company,
      achievements,
      contactPreference,
      phoneNumber,
      linkedinUrl,
      isActive,
    } = body;

    await dbConnect();

    const alumni = await Alumni.findById(id);

    if (!alumni) {
      return NextResponse.json({ error: "Alumni not found" }, { status: 404 });
    }

    // Check if email or studentId is being changed and if it conflicts
    if (email && email !== alumni.email) {
      const existingEmail = await Alumni.findOne({
        email,
        _id: { $ne: id },
      });
      if (existingEmail) {
        return NextResponse.json(
          { error: "Email is already taken by another alumni" },
          { status: 409 }
        );
      }
    }

    if (studentId && studentId !== alumni.studentId) {
      const existingStudentId = await Alumni.findOne({
        studentId,
        _id: { $ne: id },
      });
      if (existingStudentId) {
        return NextResponse.json(
          { error: "Student ID is already taken by another alumni" },
          { status: 409 }
        );
      }
    }

    // Update alumni
    const updatedAlumni = await Alumni.findByIdAndUpdate(
      id,
      {
        ...body,
        updatedBy: session.user?.name || session.user?.email || "unknown",
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      message: "Alumni updated successfully",
      alumni: updatedAlumni,
    });
  } catch (error) {
    console.error("Error updating alumni:", error);
    return NextResponse.json(
      { error: "Failed to update alumni" },
      { status: 500 }
    );
  }
}

// DELETE - Delete alumni
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    const { id } = await params;

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Get user from database to check role
    const user = await User.findOne({ email: session.user.email }).select(
      "role"
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Only admins can delete alumni
    if (user.role !== "admin") {
      return NextResponse.json(
        { error: "Only admins can delete alumni" },
        { status: 403 }
      );
    }

    await dbConnect();

    const alumni = await Alumni.findByIdAndDelete(id);

    if (!alumni) {
      return NextResponse.json({ error: "Alumni not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Alumni deleted successfully" });
  } catch (error) {
    console.error("Error deleting alumni:", error);
    return NextResponse.json(
      { error: "Failed to delete alumni" },
      { status: 500 }
    );
  }
}

// PATCH - Toggle alumni status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    const { id } = await params;

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Get user from database to check role
    const user = await User.findOne({ email: session.user.email }).select(
      "role"
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Only admins can toggle alumni status
    if (user.role !== "admin") {
      return NextResponse.json(
        { error: "Only admins can change alumni status" },
        { status: 403 }
      );
    }

    await dbConnect();

    const alumni = await Alumni.findById(id);

    if (!alumni) {
      return NextResponse.json({ error: "Alumni not found" }, { status: 404 });
    }

    alumni.isActive = !alumni.isActive;
    alumni.updatedBy = session.user?.name || session.user?.email || "unknown";
    await alumni.save();

    return NextResponse.json({
      message: "Alumni status updated successfully",
      alumni,
    });
  } catch (error) {
    console.error("Error toggling alumni status:", error);
    return NextResponse.json(
      { error: "Failed to update alumni status" },
      { status: 500 }
    );
  }
}
