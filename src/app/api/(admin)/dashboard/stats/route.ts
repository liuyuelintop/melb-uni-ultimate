import { NextResponse } from "next/server";
import dbConnect from "@shared/lib/db/mongoose";
import Player from "@shared/lib/db/models/player";
import Alumni from "@shared/lib/db/models/alumni";
import Event from "@shared/lib/db/models/event";
import Announcement from "@shared/lib/db/models/announcement";
import { requireAdmin } from "@shared/lib/auth/guards";

// Authorisation and database access make this route inherently per-request.
// Without this, `next build` may try to prerender it and execute the handler at
// build time — which reaches for a session and a database connection that do not
// exist during a build, and fails the build with "Failed to collect page data".
export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  await dbConnect();
  try {
    const [
      totalPlayers,
      totalAlumni,
      totalUpcomingEvents,
      totalPublishedAnnouncements,
    ] = await Promise.all([
      Player.countDocuments({ isActive: true }),
      Alumni.countDocuments({ isActive: true }),
      Event.countDocuments({ status: "upcoming" }),
      Announcement.countDocuments({ isPublished: true }),
    ]);
    return NextResponse.json({
      totalPlayers,
      totalAlumni,
      totalUpcomingEvents,
      totalPublishedAnnouncements,
    });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch dashboard stats: ${error}` },
      { status: 500 }
    );
  }
}
