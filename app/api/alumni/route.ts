import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from "@/lib/db/mongoose";
import Alumni from "@/lib/db/models/alumni";

// GET - Fetch all alumni
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const graduationYear = searchParams.get("graduationYear");
    const location = searchParams.get("location");
    const isActive = searchParams.get("isActive");

    const query: Record<string, string | boolean | number> = {};

    if (graduationYear && graduationYear !== "all") {
      query.graduationYear = parseInt(graduationYear);
    }

    if (location && location !== "all") {
      query.currentLocation = location;
    }

    if (isActive !== null) {
      query.isActive = isActive === "true";
    }

    const alumni = await Alumni.find(query).sort({
      graduationYear: -1,
      createdAt: -1,
    });

    // Remove unnecessary debug logs

    // Filter sensitive data for non-admin users
    const filteredAlumni = alumni.map((alum) => {
      const alumObj = alum.toObject();

      // Remove sensitive information for non-admin users
      delete alumObj.email;
      delete alumObj.phoneNumber;
      delete alumObj.linkedinUrl;
      delete alumObj.currentJob;
      delete alumObj.company;
      delete alumObj.contactPreference;

      return alumObj;
    });

    return NextResponse.json(filteredAlumni);
  } catch (error) {
    console.error("Error fetching alumni:", error);
    return NextResponse.json(
      { error: "Failed to fetch alumni" },
      { status: 500 }
    );
  }
}

// POST - Create new alumni
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
      graduationYear,
      currentLocation,
      currentJob,
      company,
      achievements,
      contactPreference,
      phoneNumber,
      linkedinUrl,
    } = body;

    // Validate required fields
    if (!name || !email || !graduationYear) {
      return NextResponse.json(
        {
          error: "Missing required fields: name, email, graduationYear",
        },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if alumni already exists (by email only)
    const existingAlumni = await Alumni.findOne({ email });
    if (existingAlumni) {
      return NextResponse.json(
        { error: "Alumni with this email already exists" },
        { status: 409 }
      );
    }

    const alumni = new Alumni({
      name,
      email,
      studentId,
      graduationYear,
      currentLocation,
      currentJob,
      company,
      achievements: achievements || [],
      contactPreference: contactPreference || "email",
      phoneNumber,
      linkedinUrl,
      isActive: true,
      createdBy: session.user?.name || session.user?.email || "unknown",
      updatedBy: session.user?.name || session.user?.email || "unknown",
    });

    await alumni.save();

    return NextResponse.json(
      { message: "Alumni created successfully", alumni },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating alumni:", error);
    return NextResponse.json(
      { error: "Failed to create alumni" },
      { status: 500 }
    );
  }
}
