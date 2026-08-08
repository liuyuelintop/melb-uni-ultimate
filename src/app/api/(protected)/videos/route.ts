import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@shared/lib/db/mongoose";
import { Video } from "@shared/lib/db/models";
import { isValidYoutubeId } from "@shared/utils/video";
import { getViewer, requireAuth } from "@shared/lib/auth/guards";

// Authorisation and database access make this route inherently per-request.
// Without this, `next build` may try to prerender it and execute the handler at
// build time — which reaches for a session and a database connection that do not
// exist during a build, and fails the build with "Failed to collect page data".
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const viewer = await getViewer();
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const published = searchParams.get("published");
    const tags = searchParams.get("tags");
    const publicOnly = searchParams.get("public") === "true";

    // Build query
    const query: Record<string, unknown> = {};

    // Filter by published status if specified
    if (published === "true") {
      query.isPublished = true;
    } else if (published === "false") {
      query.isPublished = false;
    }

    // Filter by tags if specified
    if (tags) {
      const tagArray = tags.split(",").map((tag) => tag.trim());
      query.tags = { $in: tagArray };
    }

    // Restrict visibility server-side by the caller's role
    if (publicOnly || !viewer) {
      query.isPublished = true;
      query.allowedRoles = { $in: ["public"] };
    } else if (viewer.role !== "admin") {
      // Admins see everything; everyone else only what their role allows
      query.allowedRoles = { $in: [viewer.role, "public"] };
    }

    const videos = await Video.find(query).sort({ createdAt: -1 }).limit(50);

    return NextResponse.json(videos);
  } catch (error) {
    console.error("Error fetching videos:", error);
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Any authenticated member may add a video. A non-admin's video defaults to
    // member-only visibility below, and only an admin can widen that.
    const auth = await requireAuth();
    if (!auth.ok) return auth.response;

    await dbConnect();

    const body = await request.json();
    const {
      title,
      description,
      youtubeId,
      thumbnailUrl,
      tags,
      allowedRoles,
      isPublished,
    } = body;

    // Validate required fields
    if (!title || !youtubeId) {
      return NextResponse.json(
        { error: "Title and YouTube ID are required" },
        { status: 400 }
      );
    }

    // Validate YouTube ID
    if (!isValidYoutubeId(youtubeId)) {
      return NextResponse.json(
        { error: "Invalid YouTube ID" },
        { status: 400 }
      );
    }

    // Check if video already exists
    const existingVideo = await Video.findOne({ youtubeId });
    if (existingVideo) {
      return NextResponse.json(
        { error: "Video with this YouTube ID already exists" },
        { status: 409 }
      );
    }

    // Set default values
    const defaultAllowedRoles =
      auth.viewer.role === "admin" ? ["public", "user", "admin"] : ["user"];
    const finalAllowedRoles = allowedRoles || defaultAllowedRoles;

    const video = new Video({
      title,
      description,
      youtubeId,
      thumbnailUrl:
        thumbnailUrl || `https://img.youtube.com/vi/${youtubeId}/medium.jpg`,
      tags: tags || [],
      createdBy: auth.viewer.id,
      allowedRoles: finalAllowedRoles,
      isPublished: isPublished !== undefined ? isPublished : true,
    });

    await video.save();

    return NextResponse.json(video, { status: 201 });
  } catch (error) {
    console.error("Error creating video:", error);
    return NextResponse.json(
      { error: "Failed to create video" },
      { status: 500 }
    );
  }
}
