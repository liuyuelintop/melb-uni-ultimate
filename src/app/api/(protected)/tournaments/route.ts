import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@shared/lib/db/mongoose";
import Tournament from "@shared/lib/db/models/tournament";
import { requireAdmin } from "@shared/lib/auth/guards";

// Authorisation and database access make this route inherently per-request.
// Without this, `next build` may try to prerender it and execute the handler at
// build time — which reaches for a session and a database connection that do not
// exist during a build, and fails the build with "Failed to collect page data".
export const dynamic = "force-dynamic";

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
