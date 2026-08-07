import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@shared/lib/db/mongoose";
import { RosterEntry } from "@shared/lib/db/models";
import { requireAdmin } from "@shared/lib/auth/guards";

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
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

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
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  await dbConnect();
  const { _id } = await req.json();
  if (!_id) {
    return NextResponse.json({ error: "Missing _id" }, { status: 400 });
  }
  await RosterEntry.findByIdAndDelete(_id);
  return NextResponse.json({ success: true });
}
