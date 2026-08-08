import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@shared/lib/db/mongoose";
import Event from "@shared/lib/db/models/event";
import { requireAdmin } from "@shared/lib/auth/guards";
import { buildUpdate, writeFailureResponse } from "@shared/lib/db/writes";

/**
 * The fields a PATCH may change, and which of them may be cleared.
 *
 * Spelled out rather than spread from the request body, so `createdBy`,
 * `createdAt` and `_id` stay out of reach and the update's keys are always the
 * route's own.
 */
const UPDATABLE = [
  "title",
  "description",
  "startDate",
  "endDate",
  "location",
  "type",
  "status",
  "currentParticipants",
  "registrationDeadline",
  "isPublic",
] as const;

/** Optional in the schema, so blanking it means "remove", not "store empty". */
const CLEARABLE = ["registrationDeadline"] as const;

// Authorisation and database access make this route inherently per-request.
// Without this, `next build` may try to prerender it and execute the handler at
// build time — which reaches for a session and a database connection that do not
// exist during a build, and fails the build with "Failed to collect page data".
export const dynamic = "force-dynamic";

// GET - Get single event
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await dbConnect();

    const event = await Event.findById(id);

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // After fetching the event from DB, compute status:
    const now = new Date();
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);
    let status: "upcoming" | "ongoing" | "completed";
    if (now < start) status = "upcoming";
    else if (now >= start && now <= end) status = "ongoing";
    else status = "completed";
    return NextResponse.json({ event: { ...event.toObject(), status } });
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json(
      { error: "Failed to fetch event" },
      { status: 500 }
    );
  }
}

// PATCH - Update event
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
    const event = await Event.findById(id);

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Update event
    const update = buildUpdate(
      Object.fromEntries(UPDATABLE.map((field) => [field, body[field]])),
      CLEARABLE
    );

    const updatedEvent = await Event.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json({
      message: "Event updated successfully",
      event: updatedEvent,
    });
  } catch (error) {
    console.error("Error updating event:", error);

    const failure = writeFailureResponse(error, "event");
    if (failure) return failure;

    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 }
    );
  }
}

// DELETE - Delete event
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;

    const { id } = await params;

    await dbConnect();

    const event = await Event.findByIdAndDelete(id);

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { error: "Failed to delete event" },
      { status: 500 }
    );
  }
}
