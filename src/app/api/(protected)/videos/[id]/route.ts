import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@shared/lib/db/mongoose";
import { Video } from "@shared/lib/db/models";
import { isValidYoutubeId } from "@shared/utils/video";
import { getViewer, requireAuth } from "@shared/lib/auth/guards";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const viewer = await getViewer();
    await dbConnect();

    const { id } = await params;

    const video = await Video.findById(id);

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    // Check if video is published
    if (!video.isPublished) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    if (!viewer) {
      // Anonymous access - only allow if the video is marked public
      if (!video.allowedRoles.includes("public")) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    } else if (
      viewer.role !== "admin" &&
      !video.allowedRoles.includes(viewer.role)
    ) {
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth();
    if (!auth.ok) return auth.response;

    await dbConnect();

    const { id } = await params;

    const video = await Video.findById(id);

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    // Admins may edit any video; everyone else only their own
    if (
      auth.viewer.role !== "admin" &&
      video.createdBy.toString() !== auth.viewer.id
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
      id,
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth();
    if (!auth.ok) return auth.response;

    await dbConnect();

    const { id } = await params;

    const video = await Video.findById(id);

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    // Admins may delete any video; everyone else only their own
    if (
      auth.viewer.role !== "admin" &&
      video.createdBy.toString() !== auth.viewer.id
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await Video.findByIdAndDelete(id);

    return NextResponse.json({ message: "Video deleted successfully" });
  } catch (error) {
    console.error("Error deleting video:", error);
    return NextResponse.json(
      { error: "Failed to delete video" },
      { status: 500 }
    );
  }
}
