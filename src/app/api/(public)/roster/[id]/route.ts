import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@shared/lib/db/mongoose";
import { RosterEntry } from "@shared/lib/db/models";
import { requireAdmin } from "@shared/lib/auth/guards";

// Authorisation and database access make this route inherently per-request.
// Without this, `next build` may try to prerender it and execute the handler at
// build time — which reaches for a session and a database connection that do not
// exist during a build, and fails the build with "Failed to collect page data".
export const dynamic = "force-dynamic";

// DELETE /api/roster/[id]
// Next.js App Router API route: context must be 'any' due to lack of exported type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function DELETE(req: NextRequest, context: any) {
  const params = await context.params;
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  await dbConnect();
  const { id } = params;
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }
  const deleted = await RosterEntry.findByIdAndDelete(id);
  if (!deleted) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
