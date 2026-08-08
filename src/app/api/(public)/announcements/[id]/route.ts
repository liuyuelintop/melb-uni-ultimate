import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@shared/lib/db/mongoose";
import Announcement from "@shared/lib/db/models/announcement";
import { requireAdmin } from "@shared/lib/auth/guards";
import { buildUpdate, writeFailureResponse } from "@shared/lib/db/writes";

/**
 * The fields a PATCH may change.
 *
 * Spelled out rather than spread from the request body, so `author`,
 * `createdAt`, `publishedAt` and `_id` stay out of reach — `publishedAt` in
 * particular is the server's to stamp, not the caller's to set.
 */
const UPDATABLE = ["title", "content", "priority", "isPublished"] as const;

// Authorisation and database access make this route inherently per-request.
// Without this, `next build` may try to prerender it and execute the handler at
// build time — which reaches for a session and a database connection that do not
// exist during a build, and fails the build with "Failed to collect page data".
export const dynamic = "force-dynamic";

// GET - Get single announcement
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await dbConnect();

    const announcement = await Announcement.findById(id);

    if (!announcement) {
      return NextResponse.json(
        { error: "Announcement not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ announcement });
  } catch (error) {
    console.error("Error fetching announcement:", error);
    return NextResponse.json(
      { error: "Failed to fetch announcement" },
      { status: 500 }
    );
  }
}

// PATCH - Update announcement
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;

    const { id } = await params;

    await dbConnect();

    const body = await request.json();
    const { isPublished } = body;

    const announcement = await Announcement.findById(id);

    if (!announcement) {
      return NextResponse.json(
        { error: "Announcement not found" },
        { status: 404 }
      );
    }

    // Update announcement. publishedAt is stamped by the server on publish, and
    // left alone otherwise — an undefined value is skipped, which preserves the
    // existing behaviour of not clearing it on unpublish.
    const update = buildUpdate({
      ...Object.fromEntries(UPDATABLE.map((field) => [field, body[field]])),
      publishedAt: isPublished ? new Date() : undefined,
    });

    const updatedAnnouncement = await Announcement.findByIdAndUpdate(
      id,
      update,
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      message: "Announcement updated successfully",
      announcement: updatedAnnouncement,
    });
  } catch (error) {
    console.error("Error updating announcement:", error);

    const failure = writeFailureResponse(error, "announcement");
    if (failure) return failure;

    return NextResponse.json(
      { error: "Failed to update announcement" },
      { status: 500 }
    );
  }
}

// DELETE - Delete announcement
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;

    const { id } = await params;

    await dbConnect();

    const announcement = await Announcement.findByIdAndDelete(id);

    if (!announcement) {
      return NextResponse.json(
        { error: "Announcement not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Announcement deleted successfully" });
  } catch (error) {
    console.error("Error deleting announcement:", error);
    return NextResponse.json(
      { error: "Failed to delete announcement" },
      { status: 500 }
    );
  }
}
