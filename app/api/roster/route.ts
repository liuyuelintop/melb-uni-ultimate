import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongoose";
import { RosterEntry, Player, Tournament } from "@/lib/db/models";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// GET /api/roster?tournamentId=...
export async function GET(req: NextRequest) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const tournamentId = searchParams.get("tournamentId");
  if (!tournamentId) {
    return NextResponse.json(
      { error: "Missing tournamentId" },
      { status: 400 }
    );
  }
  const roster = await RosterEntry.find({ tournamentId })
    .populate("playerId")
    .populate("tournamentId")
    .populate("teamId");
  return NextResponse.json(roster);
}

// POST /api/roster
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  await dbConnect();
  const data = await req.json();

  // Clean up empty strings to undefined for optional fields
  if (data.role === "") data.role = undefined;
  if (data.position === "") data.position = undefined;
  if (data.notes === "") data.notes = undefined;

  const entry = await RosterEntry.create(data);
  return NextResponse.json(entry);
}

// DELETE /api/roster (expects { _id })
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  await dbConnect();
  const { _id } = await req.json();
  if (!_id) {
    return NextResponse.json({ error: "Missing _id" }, { status: 400 });
  }
  await RosterEntry.findByIdAndDelete(_id);
  return NextResponse.json({ success: true });
}
