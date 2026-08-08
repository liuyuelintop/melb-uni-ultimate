import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@shared/lib/db/mongoose";
import { requireAdmin, attributionOf } from "@shared/lib/auth/guards";
import Event from "@shared/lib/db/models/event";

// Authorisation and database access make this route inherently per-request.
// Without this, `next build` may try to prerender it and execute the handler at
// build time — which reaches for a session and a database connection that do not
// exist during a build, and fails the build with "Failed to collect page data".
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const publicOnly = searchParams.get("public");
    const status = searchParams.get("status");

    const query: Record<string, unknown> = {};
    if (publicOnly === "true") {
      query.isPublic = true;
    }
    if (status) {
      query.status = status;
    }

    const events = await Event.find(query).sort({ startDate: 1 }).limit(50);

    const now = new Date();
    const eventsWithStatus = events.map((event) => {
      let status: "upcoming" | "ongoing" | "completed";
      const start = new Date(event.startDate);
      const end = new Date(event.endDate);
      if (now < start) status = "upcoming";
      else if (now >= start && now <= end) status = "ongoing";
      else status = "completed";
      return { ...event.toObject(), status };
    });
    return NextResponse.json(eventsWithStatus);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;

    await dbConnect();

    const body = await request.json();
    const {
      title,
      description,
      startDate,
      endDate,
      location,
      type,
      registrationDeadline,
      isPublic,
    } = body;

    // Validate required fields
    if (!title || !startDate || !endDate || !location || !type) {
      return NextResponse.json(
        {
          error: "Title, start date, end date, location, and type are required",
        },
        { status: 400 }
      );
    }

    const event = new Event({
      title,
      description: description || "",
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      location,
      type,
      status: "upcoming",
      currentParticipants: 0,
      registrationDeadline: registrationDeadline
        ? new Date(registrationDeadline)
        : undefined,
      isPublic: isPublic !== undefined ? isPublic : true,
      createdBy: attributionOf(auth.viewer),
    });

    await event.save();

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}
