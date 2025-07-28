import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@shared/lib/db/mongoose";
import { Video } from "@shared/lib/db/models";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const published = searchParams.get("published");
    const tags = searchParams.get("tags");

    // Build query for public access
    const query: Record<string, unknown> = {
      isPublished: true,
      allowedRoles: { $in: ["public"] },
    };

    // Filter by published status if specified
    if (published === "false") {
      query.isPublished = false;
    }

    // Filter by tags if specified
    if (tags) {
      const tagArray = tags.split(",").map((tag) => tag.trim());
      query.tags = { $in: tagArray };
    }

    const videos = await Video.find(query).sort({ createdAt: -1 }).limit(20);

    return NextResponse.json(videos);
  } catch (error) {
    console.error("Error fetching videos:", error);
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}
