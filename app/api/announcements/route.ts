import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/db/mongoose";
import Announcement from "@/lib/db/models/announcement";

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
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
      author: author || session.user?.name || session.user?.email || "Admin",
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
