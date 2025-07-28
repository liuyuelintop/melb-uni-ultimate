import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@shared/lib/db/mongoose";
import { Video, User } from "@shared/lib/db/models";
import { extractYoutubeId, isValidYoutubeId } from "@shared/utils/video";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
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

    // Handle public vs authenticated access
    if (publicOnly || !session?.user?.email) {
      // Public access - only show videos with public access
      query.isPublished = true;
      query.allowedRoles = { $in: ["public"] };
    } else {
      // Authenticated access - get user to check their role
      const user = await User.findOne({ email: session.user.email });
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      // Filter by allowed roles based on user role
      if (user.role === "admin") {
        // Admins can see all videos
      } else {
        // Regular users can only see videos they have access to
        query.allowedRoles = { $in: [user.role, "public"] };
      }
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
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Get user to check their role
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Only admins and users can create videos
    if (user.role !== "admin" && user.role !== "user") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

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
      user.role === "admin" ? ["public", "user", "admin"] : ["user"];
    const finalAllowedRoles = allowedRoles || defaultAllowedRoles;

    const video = new Video({
      title,
      description,
      youtubeId,
      thumbnailUrl:
        thumbnailUrl || `https://img.youtube.com/vi/${youtubeId}/medium.jpg`,
      tags: tags || [],
      createdBy: user._id,
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
