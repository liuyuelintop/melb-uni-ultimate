import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@shared/lib/db/mongoose";
import { requireAdmin, attributionOf } from "@shared/lib/auth/guards";
import { Announcement } from "@shared/lib/db/models";

// Authorisation and database access make this route inherently per-request.
// Without this, `next build` may try to prerender it and execute the handler at
// build time — which reaches for a session and a database connection that do not
// exist during a build, and fails the build with "Failed to collect page data".
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const published = searchParams.get("published");

    let query = {};
    if (published === "true") {
      query = { isPublished: true };
    }

    const announcements = await Announcement.find(query)
      .sort({ createdAt: -1 })
      .limit(20);

    return NextResponse.json(announcements);
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return NextResponse.json(
      { error: "Failed to fetch announcements" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;

    await dbConnect();

    const body = await request.json();
    const { title, content, author, priority, isPublished } = body;

    // Validate required fields
    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    const announcement = new Announcement({
      title,
      content,
      author: author || attributionOf(auth.viewer),
      priority: priority || "medium",
      isPublished: isPublished || false,
      publishedAt: isPublished ? new Date() : undefined,
    });

    await announcement.save();

    return NextResponse.json(announcement, { status: 201 });
  } catch (error) {
    console.error("Error creating announcement:", error);
    return NextResponse.json(
      { error: "Failed to create announcement" },
      { status: 500 }
    );
  }
}
