import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@shared/lib/db/mongoose";
import Tournament from "@shared/lib/db/models/tournament";
import { requireAdmin } from "@shared/lib/auth/guards";

// GET /api/tournaments
export async function GET() {
  await dbConnect();
  const tournaments = await Tournament.find().sort({ startDate: 1 });
  return NextResponse.json(tournaments);
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  await dbConnect();
  const data = await req.json();
  const tournament = await Tournament.create(data);
  return NextResponse.json(tournament);
}
