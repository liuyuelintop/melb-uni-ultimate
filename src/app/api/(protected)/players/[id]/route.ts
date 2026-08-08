import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@shared/lib/db/mongoose";
import Player from "@shared/lib/db/models/player";
import { requireAdmin, attributionOf } from "@shared/lib/auth/guards";

// Authorisation and database access make this route inherently per-request.
// Without this, `next build` may try to prerender it and execute the handler at
// build time — which reaches for a session and a database connection that do not
// exist during a build, and fails the build with "Failed to collect page data".
export const dynamic = "force-dynamic";

// PUT - Update player
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;

    const { id } = await params;
    const body = await request.json();
    const { email, studentId } = body;

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
        updatedBy: attributionOf(auth.viewer),
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
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;

    const { id } = await params;

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
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;

    const { id } = await params;

    await dbConnect();

    const player = await Player.findById(id);

    if (!player) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 });
    }

    player.isActive = !player.isActive;
    player.updatedBy = attributionOf(auth.viewer);
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
