import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@shared/lib/db/mongoose";
import User from "@shared/lib/db/models/user";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await dbConnect();

    // Find user in database
    const user = await User.findOne({ email: session.user.email }).select(
      "-password"
    );

    if (!user) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      session: {
        user: session.user,
      },
      database: {
        user: user,
      },
      comparison: {
        sessionRole: session.user.role,
        databaseRole: user.role,
        rolesMatch: session.user.role === user.role,
        sessionName: session.user.name,
        databaseName: user.name,
        namesMatch: session.user.name === user.name,
      },
    });
  } catch (error) {
    console.error("Error debugging user:", error);
    return NextResponse.json(
      { error: "Failed to debug user" },
      { status: 500 }
    );
  }
}
