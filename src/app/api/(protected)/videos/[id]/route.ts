import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@shared/lib/db/mongoose";
import { Video, User } from "@shared/lib/db/models";
import { isValidYoutubeId } from "@shared/utils/video";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const video = await Video.findById(params.id);

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    // Check if user has access to this video
    if (user.role !== "admin" && !video.allowedRoles.includes(user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(video);
  } catch (error) {
    console.error("Error fetching video:", error);
    return NextResponse.json(
      { error: "Failed to fetch video" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const video = await Video.findById(params.id);

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    // Check if user can edit this video (admin or creator)
    if (
      user.role !== "admin" &&
      video.createdBy.toString() !== user._id.toString()
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const {
      title,
      description,
      thumbnailUrl,
      tags,
      allowedRoles,
      isPublished,
    } = body;

    // Validate YouTube ID if provided
    if (body.youtubeId && !isValidYoutubeId(body.youtubeId)) {
      return NextResponse.json(
        { error: "Invalid YouTube ID" },
        { status: 400 }
      );
    }

    // Check if YouTube ID already exists (if changed)
    if (body.youtubeId && body.youtubeId !== video.youtubeId) {
      const existingVideo = await Video.findOne({ youtubeId: body.youtubeId });
      if (existingVideo) {
        return NextResponse.json(
          { error: "Video with this YouTube ID already exists" },
          { status: 409 }
        );
      }
    }

    // Update video
    const updatedVideo = await Video.findByIdAndUpdate(
      params.id,
      {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(body.youtubeId && { youtubeId: body.youtubeId }),
        ...(thumbnailUrl && { thumbnailUrl }),
        ...(tags && { tags }),
        ...(allowedRoles && { allowedRoles }),
        ...(isPublished !== undefined && { isPublished }),
      },
      { new: true }
    );

    return NextResponse.json(updatedVideo);
  } catch (error) {
    console.error("Error updating video:", error);
    return NextResponse.json(
      { error: "Failed to update video" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const video = await Video.findById(params.id);

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    // Check if user can delete this video (admin or creator)
    if (
      user.role !== "admin" &&
      video.createdBy.toString() !== user._id.toString()
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await Video.findByIdAndDelete(params.id);

    return NextResponse.json({ message: "Video deleted successfully" });
  } catch (error) {
    console.error("Error deleting video:", error);
    return NextResponse.json(
      { error: "Failed to delete video" },
      { status: 500 }
    );
  }
}
