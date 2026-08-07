import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@shared/lib/db/mongoose";
import Event from "@shared/lib/db/models/event";
import { requireAdmin } from "@shared/lib/auth/guards";

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
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      {
        ...body,
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      message: "Event updated successfully",
      event: updatedEvent,
    });
  } catch (error) {
    console.error("Error updating event:", error);
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
