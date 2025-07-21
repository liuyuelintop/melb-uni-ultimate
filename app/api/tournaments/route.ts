import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongoose";
import Tournament from "@/lib/db/models/tournament";

// GET /api/tournaments
export async function GET(req: NextRequest) {
  await dbConnect();
  const tournaments = await Tournament.find().sort({ startDate: 1 });
  return NextResponse.json(tournaments);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  await dbConnect();
  const data = await req.json();
  const tournament = await Tournament.create(data);
  return NextResponse.json(tournament);
}
