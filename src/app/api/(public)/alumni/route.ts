import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@shared/lib/db/mongoose";
import {
  requireAdmin,
  viewerIsAdmin,
  attributionOf,
} from "@shared/lib/auth/guards";
import Alumni from "@shared/lib/db/models/alumni";

// Authorisation and database access make this route inherently per-request.
// Without this, `next build` may try to prerender it and execute the handler at
// build time — which reaches for a session and a database connection that do not
// exist during a build, and fails the build with "Failed to collect page data".
export const dynamic = "force-dynamic";

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

    // Contact and employment details are withheld from non-admin callers
    // server-side, so unauthorised clients never receive them.
    let filteredAlumni;
    if (await viewerIsAdmin()) {
      filteredAlumni = alumni.map((alum) => alum.toObject());
    } else {
      filteredAlumni = alumni.map((alum) => {
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
    }

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
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;

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
      createdBy: attributionOf(auth.viewer),
      updatedBy: attributionOf(auth.viewer),
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
