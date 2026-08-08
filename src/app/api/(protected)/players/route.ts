import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@shared/lib/db/mongoose";
import {
  requireAdmin,
  viewerIsAdmin,
  attributionOf,
} from "@shared/lib/auth/guards";
import { optional, writeFailureResponse } from "@shared/lib/db/writes";
import Player from "@shared/lib/db/models/player";

// Authorisation and database access make this route inherently per-request.
// Without this, `next build` may try to prerender it and execute the handler at
// build time — which reaches for a session and a database connection that do not
// exist during a build, and fails the build with "Failed to collect page data".
export const dynamic = "force-dynamic";

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

    // Contact details are withheld from non-admin callers server-side, so
    // unauthorised clients never receive them.
    const isAdmin = await viewerIsAdmin();

    const filteredPlayers = players.map((player) => {
      const playerObj = player.toObject();

      if (!isAdmin) {
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
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;

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

    // Optional text fields are omitted rather than written as null: a unique
    // index counts every null as the same value, so the second player without a
    // student ID would collide with the first.
    const player = new Player({
      name,
      email,
      gender,
      position: position || "cutter",
      experience: experience || "beginner",
      jerseyNumber,
      graduationYear,
      isActive: true,
      createdBy: attributionOf(auth.viewer),
      updatedBy: attributionOf(auth.viewer),
      ...optional({ studentId, phoneNumber }),
    });

    await player.save();

    return NextResponse.json(
      { message: "Player created successfully", player },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating player:", error);

    const known = writeFailureResponse(error, "player");
    if (known) return known;

    return NextResponse.json(
      { error: "Failed to create player" },
      { status: 500 }
    );
  }
}
