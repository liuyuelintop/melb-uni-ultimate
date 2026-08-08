import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@shared/lib/db/mongoose";
import Alumni from "@shared/lib/db/models/alumni";
import { requireAdmin, attributionOf } from "@shared/lib/auth/guards";
import { buildUpdate, writeFailureResponse } from "@shared/lib/db/writes";

/**
 * The fields a PUT may change, and which of them may be cleared.
 *
 * Spelled out rather than spread from the request body, so `createdBy`,
 * `createdAt` and `_id` stay out of reach and the update's keys are always the
 * route's own.
 */
const UPDATABLE = [
  "name",
  "email",
  "studentId",
  "affiliation",
  "graduationYear",
  "currentLocation",
  "currentJob",
  "company",
  "achievements",
  "contactPreference",
  "phoneNumber",
  "linkedinUrl",
  "isActive",
] as const;

/** Optional in the schema, so blanking them means "remove", not "store empty". */
const CLEARABLE = [
  "studentId",
  "affiliation",
  "currentLocation",
  "currentJob",
  "company",
  "phoneNumber",
  "linkedinUrl",
] as const;

// Authorisation and database access make this route inherently per-request.
// Without this, `next build` may try to prerender it and execute the handler at
// build time — which reaches for a session and a database connection that do not
// exist during a build, and fails the build with "Failed to collect page data".
export const dynamic = "force-dynamic";

// PUT - Update alumni
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

    if (studentId && studentId !== alumni.studentId && studentId !== "") {
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
    const submitted = Object.fromEntries(
      UPDATABLE.map((field) => [field, body[field]])
    );

    const update = buildUpdate(
      { ...submitted, updatedBy: attributionOf(auth.viewer) },
      CLEARABLE
    );

    const updatedAlumni = await Alumni.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json({
      message: "Alumni updated successfully",
      alumni: updatedAlumni,
    });
  } catch (error) {
    console.error("Error updating alumni:", error);

    const failure = writeFailureResponse(error, "alumni record");
    if (failure) return failure;

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
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;

    const { id } = await params;

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
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;

    const { id } = await params;

    await dbConnect();

    const alumni = await Alumni.findById(id);

    if (!alumni) {
      return NextResponse.json({ error: "Alumni not found" }, { status: 404 });
    }

    alumni.isActive = !alumni.isActive;
    alumni.updatedBy = attributionOf(auth.viewer);
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
