import { NextResponse } from "next/server";
import dbConnect from "@shared/lib/db/mongoose";
import Player from "@shared/lib/db/models/player";
import Alumni from "@shared/lib/db/models/alumni";
import Event from "@shared/lib/db/models/event";
import Announcement from "@shared/lib/db/models/announcement";

export async function GET() {
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
