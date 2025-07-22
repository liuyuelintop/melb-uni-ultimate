import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/db/mongoose";
import Player from "@/lib/db/models/player";
import User from "@/lib/db/models/user";

// PUT - Update player
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
      gender,
      position,
      experience,
      jerseyNumber,
      phoneNumber,
      graduationYear,
      isActive,
    } = body;

    await dbConnect();

    const player = await Player.findById(id);

    if (!player) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 });
    }

    // Check if email or studentId is being changed and if it conflicts
    if (email && email !== player.email) {
      const existingEmail = await Player.findOne({
        email,
        _id: { $ne: id },
      });
      if (existingEmail) {
        return NextResponse.json(
          { error: "Email is already taken by another player" },
          { status: 409 }
        );
      }
    }

    if (studentId && studentId !== player.studentId && studentId !== "") {
      const existingStudentId = await Player.findOne({
        studentId,
        _id: { $ne: id },
      });
      if (existingStudentId) {
        return NextResponse.json(
          { error: "Student ID is already taken by another player" },
          { status: 409 }
        );
      }
    }

    // Update player
    const updatedPlayer = await Player.findByIdAndUpdate(
      id,
      {
        ...body,
        updatedBy: session.user?.name || session.user?.email || "unknown",
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      message: "Player updated successfully",
      player: updatedPlayer,
    });
  } catch (error) {
    console.error("Error updating player:", error);
    return NextResponse.json(
      { error: "Failed to update player" },
      { status: 500 }
    );
  }
}

// DELETE - Delete player
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    const { id } = await params;

    console.log("DELETE /api/players/[id] - Session:", session);

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

    console.log("DELETE /api/players/[id] - Database user role:", user.role);

    // Only admins can delete players
    if (user.role !== "admin") {
      console.log(
        "DELETE /api/players/[id] - Access denied. User role:",
        user.role
      );
      return NextResponse.json(
        { error: "Only admins can delete players" },
        { status: 403 }
      );
    }

    await dbConnect();

    const player = await Player.findByIdAndDelete(id);

    if (!player) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Player deleted successfully" });
  } catch (error) {
    console.error("Error deleting player:", error);
    return NextResponse.json(
      { error: "Failed to delete player" },
      { status: 500 }
    );
  }
}

// PATCH - Toggle player status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    const { id } = await params;

    console.log("PATCH /api/players/[id] - Session:", session);
    console.log("PATCH /api/players/[id] - Session user:", session?.user);

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

    console.log("PATCH /api/players/[id] - Database user role:", user.role);

    // Only admins can toggle player status
    if (user.role !== "admin") {
      console.log(
        "PATCH /api/players/[id] - Access denied. User role:",
        user.role
      );
      return NextResponse.json(
        { error: "Only admins can change player status" },
        { status: 403 }
      );
    }

    await dbConnect();

    const player = await Player.findById(id);

    if (!player) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 });
    }

    player.isActive = !player.isActive;
    player.updatedBy = session.user?.name || session.user?.email || "unknown";
    await player.save();

    return NextResponse.json({
      message: "Player status updated successfully",
      player,
    });
  } catch (error) {
    console.error("Error toggling player status:", error);
    return NextResponse.json(
      { error: "Failed to update player status" },
      { status: 500 }
    );
  }
}
