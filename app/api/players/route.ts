import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from "@/lib/db/mongoose";
import Player from "@/lib/db/models/player";

// GET - Fetch all players
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const position = searchParams.get("position");
    const experience = searchParams.get("experience");
    const isActive = searchParams.get("isActive");

    const query: Record<string, string | boolean> = {};

    if (position && position !== "all") {
      query.position = position;
    }

    if (experience && experience !== "all") {
      query.experience = experience;
    }

    if (isActive !== null) {
      query.isActive = isActive === "true";
    }

    const players = await Player.find(query).sort({ createdAt: -1 });

    // Check if user is admin to determine what data to return
    const session = await getServerSession(authOptions);
    console.log("Players API - Session:", session);
    console.log("Players API - Session user:", session?.user);
    console.log("Players API - Session user role:", session?.user?.role);
    const isAdmin = session?.user?.role === "admin";
    console.log("Players API - Is Admin:", isAdmin);

    // Use session-based admin check only
    const forceAdmin = isAdmin;
    console.log("Players API - Force Admin:", forceAdmin);

    // Filter sensitive data for non-admin users
    const filteredPlayers = players.map((player) => {
      const playerObj = player.toObject();

      if (!forceAdmin) {
        // Remove sensitive information for non-admin users
        delete playerObj.email;
        delete playerObj.phoneNumber;
      }

      return playerObj;
    });

    return NextResponse.json(filteredPlayers);
  } catch (error) {
    console.error("Error fetching players:", error);
    return NextResponse.json(
      { error: "Failed to fetch players" },
      { status: 500 }
    );
  }
}

// POST - Create new player
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      email,
      studentId,
      gender,
      position,
      experience,
      jerseyNumber,
      phoneNumber,
      graduationYear,
    } = body;

    // Validate required fields
    if (!name || !email || !gender || !jerseyNumber || !graduationYear) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: name, email, gender, jerseyNumber, graduationYear",
        },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if player already exists (by email only)
    const existingPlayer = await Player.findOne({ email });
    if (existingPlayer) {
      return NextResponse.json(
        { error: "Player with this email already exists" },
        { status: 409 }
      );
    }

    // Check if jersey number is already taken
    const existingJersey = await Player.findOne({ jerseyNumber });
    if (existingJersey) {
      return NextResponse.json(
        { error: "Jersey number is already taken" },
        { status: 409 }
      );
    }

    const player = new Player({
      name,
      email,
      studentId,
      gender,
      position: position || "any",
      experience: experience || "beginner",
      jerseyNumber,
      phoneNumber,
      graduationYear,
      isActive: true,
      createdBy: session.user?.name || session.user?.email || "unknown",
      updatedBy: session.user?.name || session.user?.email || "unknown",
    });

    await player.save();

    return NextResponse.json(
      { message: "Player created successfully", player },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating player:", error);
    return NextResponse.json(
      { error: "Failed to create player" },
      { status: 500 }
    );
  }
}
