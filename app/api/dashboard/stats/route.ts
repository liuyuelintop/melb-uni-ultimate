import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongoose";
import Player from "@/lib/db/models/player";
import Alumni from "@/lib/db/models/alumni";
import Event from "@/lib/db/models/event";
import Announcement from "@/lib/db/models/announcement";

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
