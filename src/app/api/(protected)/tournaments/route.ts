import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@shared/lib/db/mongoose";
import Tournament from "@shared/lib/db/models/tournament";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

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
