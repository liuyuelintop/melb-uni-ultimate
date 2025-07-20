import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db/mongoose";
import User from "@/lib/db/models/user";
import Player from "@/lib/db/models/player";
import Alumni from "@/lib/db/models/alumni";
import Event from "@/lib/db/models/event";
import Announcement from "@/lib/db/models/announcement";

// Sample data
const samplePlayers = [
  {
    name: "Sarah Chen",
    email: "sarah.chen@student.unimelb.edu.au",
    // studentId intentionally omitted
    gender: "female" as const,
    position: "handler" as const,
    experience: "advanced" as const,
    jerseyNumber: 7,
    phoneNumber: "+61 400 123 456",
    graduationYear: 2025,
    isActive: true,
    createdBy: "admin",
    updatedBy: "admin",
  },
  {
    name: "Michael Rodriguez",
    email: "michael.rodriguez@student.unimelb.edu.au",
    studentId: "23456789",
    gender: "male" as const,
    position: "cutter" as const,
    experience: "intermediate" as const,
    jerseyNumber: 12,
    phoneNumber: "+61 400 234 567",
    graduationYear: 2024,
    isActive: true,
    createdBy: "admin",
    updatedBy: "admin",
  },
  {
    name: "Emma Thompson",
    email: "emma.thompson@student.unimelb.edu.au",
    studentId: "34567890",
    gender: "female" as const,
    position: "any" as const,
    experience: "expert" as const,
    jerseyNumber: 3,
    phoneNumber: "+61 400 345 678",
    graduationYear: 2026,
    isActive: true,
    createdBy: "admin",
    updatedBy: "admin",
  },
  {
    name: "James Wilson",
    email: "james.wilson@student.unimelb.edu.au",
    studentId: "45678901",
    gender: "male" as const,
    position: "handler" as const,
    experience: "beginner" as const,
    jerseyNumber: 15,
    phoneNumber: "+61 400 456 789",
    graduationYear: 2027,
    isActive: true,
    createdBy: "admin",
    updatedBy: "admin",
  },
  {
    name: "Lisa Park",
    email: "lisa.park@student.unimelb.edu.au",
    studentId: "56789012",
    gender: "female" as const,
    position: "cutter" as const,
    experience: "advanced" as const,
    jerseyNumber: 22,
    phoneNumber: "+61 400 567 890",
    graduationYear: 2025,
    isActive: true,
    createdBy: "admin",
    updatedBy: "admin",
  },
];

const sampleAlumni = [
  {
    name: "David Johnson",
    email: "david.johnson@alumni.unimelb.edu.au",
    // studentId intentionally omitted
    graduationYear: 2020,
    // currentLocation, currentJob, company intentionally omitted
    achievements: [
      "National Ultimate Frisbee Champion 2019",
      "Club Captain 2018-2019",
      "Most Valuable Player 2018",
    ],
    contactPreference: "email" as const,
    phoneNumber: "+61 400 987 654",
    linkedinUrl: "https://linkedin.com/in/davidjohnson",
    isActive: true,
    createdBy: "admin",
    updatedBy: "admin",
  },
  {
    name: "Maria Garcia",
    email: "maria.garcia@alumni.unimelb.edu.au",
    studentId: "76543210",
    graduationYear: 2021,
    currentLocation: "Sydney, Australia",
    currentJob: "Data Scientist",
    company: "Google",
    achievements: [
      "Regional Tournament Winner 2020",
      "Team Spirit Award 2019",
      "Academic Excellence Award",
    ],
    contactPreference: "linkedin" as const,
    linkedinUrl: "https://linkedin.com/in/mariagarcia",
    isActive: true,
    createdBy: "admin",
    updatedBy: "admin",
  },
  {
    name: "Alex Chen",
    email: "alex.chen@alumni.unimelb.edu.au",
    graduationYear: 2019,
    // Minimal info - just the essentials
    achievements: ["Club Member 2017-2019"],
    contactPreference: "email" as const,
    isActive: true,
    createdBy: "admin",
    updatedBy: "admin",
  },
];

const sampleEvents = [
  {
    title: "Weekly Practice Session",
    description:
      "Join us for our regular weekly practice session. All skill levels welcome!",
    startDate: new Date("2024-02-20T18:00:00"),
    endDate: new Date("2024-02-20T20:00:00"),
    location: "University Sports Complex",
    type: "practice" as const,
    status: "upcoming" as const,
    currentParticipants: 15,
    maxParticipants: 25,
    isPublic: true,
    createdBy: "admin",
  },
  {
    title: "State Championship Tournament",
    description:
      "Annual state championship tournament. Register your team now!",
    startDate: new Date("2024-03-15T09:00:00"),
    endDate: new Date("2024-03-17T18:00:00"),
    location: "Melbourne Sports Centre",
    type: "tournament" as const,
    status: "upcoming" as const,
    currentParticipants: 8,
    maxParticipants: 16,
    registrationDeadline: new Date("2024-03-10T23:59:59"),
    isPublic: true,
    createdBy: "admin",
  },
  {
    title: "Social Mixer",
    description: "Casual social event to meet other players and have fun!",
    startDate: new Date("2024-02-25T19:00:00"),
    endDate: new Date("2024-02-25T22:00:00"),
    location: "University Bar",
    type: "social" as const,
    status: "upcoming" as const,
    currentParticipants: 12,
    maxParticipants: 30,
    isPublic: true,
    createdBy: "admin",
  },
  {
    title: "Advanced Training Camp",
    description:
      "Intensive training camp for advanced players. Focus on strategy and skills.",
    startDate: new Date("2024-03-08T10:00:00"),
    endDate: new Date("2024-03-08T16:00:00"),
    location: "University Oval",
    type: "training" as const,
    status: "upcoming" as const,
    currentParticipants: 6,
    maxParticipants: 12,
    registrationDeadline: new Date("2024-03-05T23:59:59"),
    isPublic: true,
    createdBy: "admin",
  },
];

const sampleAnnouncements = [
  {
    title: "Welcome to the New Season!",
    content:
      "We're excited to announce the start of our new frisbee season. Join us for practices and tournaments!",
    author: "Club Admin",
    priority: "high" as const,
    isPublished: true,
    publishedAt: new Date(),
  },
  {
    title: "Weekly Practice Schedule",
    content:
      "Regular practices will be held every Tuesday and Thursday from 6-8 PM at the University Sports Complex.",
    author: "Coach Mike",
    priority: "medium" as const,
    isPublished: true,
    publishedAt: new Date(),
  },
  {
    title: "Tournament Registration Open",
    content:
      "Registration for the upcoming State Championship is now open. Teams must register by March 10th.",
    author: "Tournament Director",
    priority: "high" as const,
    isPublished: true,
    publishedAt: new Date(),
  },
  {
    title: "New Equipment Arrival",
    content:
      "New discs and cones have arrived! We'll be using them starting from next week's practice.",
    author: "Equipment Manager",
    priority: "low" as const,
    isPublished: true,
    publishedAt: new Date(),
  },
];

const sampleAdminUser = {
  name: "Admin User",
  email: "admin@muultimate.com",
  password: "admin123",
  // studentId intentionally omitted
  gender: "other" as const,
  phoneNumber: "+61 400 000 000",
  position: "any" as const,
  experience: "expert" as const,
  role: "admin" as const,
  isVerified: true,
};

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    // Temporarily allow seeding in production for initial setup
    // TODO: Re-enable admin check after initial setup
    // if (
    //   process.env.NODE_ENV === "production" &&
    //   session?.user?.role !== "admin"
    // ) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    await dbConnect();

    // Clear existing data (but keep users)
    await Player.deleteMany({});
    await Alumni.deleteMany({});
    await Event.deleteMany({});
    await Announcement.deleteMany({});

    // Create admin user or update existing user
    const existingUser = await User.findOne({ email: sampleAdminUser.email });

    if (existingUser) {
      // Update existing user to admin
      existingUser.role = "admin";
      existingUser.isVerified = true;
      await existingUser.save();
      console.log("Updated existing user to admin");
    } else {
      // Create new admin user
      const hashedPassword = await bcrypt.hash(sampleAdminUser.password, 12);
      const adminUser = new User({
        ...sampleAdminUser,
        password: hashedPassword,
      });
      await adminUser.save();
      console.log("Created new admin user");
    }

    // Create sample players
    for (const playerData of samplePlayers) {
      const player = new Player(playerData);
      await player.save();
    }

    // Create sample alumni
    for (const alumniData of sampleAlumni) {
      const alumni = new Alumni(alumniData);
      await alumni.save();
    }

    // Create sample events
    for (const eventData of sampleEvents) {
      const event = new Event(eventData);
      await event.save();
    }

    // Create sample announcements
    for (const announcementData of sampleAnnouncements) {
      const announcement = new Announcement(announcementData);
      await announcement.save();
    }

    // Update all existing users to admin (for testing)
    const allUsers = await User.find({});
    for (const user of allUsers) {
      user.role = "admin";
      user.isVerified = true;
      await user.save();
    }
    console.log(`Updated ${allUsers.length} users to admin`);

    return NextResponse.json({
      message: "Database seeded successfully!",
      adminCredentials: {
        email: "admin@muultimate.com",
        password: "admin123",
      },
      created: {
        users: 1,
        players: samplePlayers.length,
        alumni: sampleAlumni.length,
        events: sampleEvents.length,
        announcements: sampleAnnouncements.length,
      },
    });
  } catch (error) {
    console.error("Error seeding database:", error);
    return NextResponse.json(
      { error: "Failed to seed database" },
      { status: 500 }
    );
  }
}
