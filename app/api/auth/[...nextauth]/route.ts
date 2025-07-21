import NextAuth, { DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/db/mongodb";
import dbConnect from "@/lib/db/mongoose";
import User from "@/lib/db/models/user";
import bcrypt from "bcryptjs";
import { JWT } from "next-auth/jwt";

// Extend the User type to include our custom fields
declare module "next-auth" {
  interface User {
    role?: string;
    studentId?: string;
    position?: string;
    experience?: string;
    isVerified?: boolean;
  }
  interface Session {
    user: {
      id: string;
      role: string;
      studentId?: string;
      position?: string;
      experience?: string;
      isVerified?: boolean;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    studentId?: string;
    position?: string;
    experience?: string;
    isVerified?: boolean;
  }
}

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          await dbConnect();

          const user = await User.findOne({ email: credentials.email });

          if (!user) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            return null;
          }

          const userData = {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            studentId: user.studentId,
            position: user.position,
            experience: user.experience,
            isVerified: user.isVerified,
          };

          console.log("Authorize function - Returning user data:", userData);
          return userData;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user: any }) {
      if (user) {
        token.role = user.role;
        token.studentId = user.studentId;
        token.position = user.position;
        token.experience = user.experience;
        token.isVerified = user.isVerified;

        // Debug logging
        console.log("JWT callback - User:", user);
        console.log("JWT callback - Token after update:", token);
      }
      return token;
    },
    async session({ session, token }: { session: any; token: JWT }) {
      if (token) {
        // Ensure all user fields are properly set
        session.user = {
          ...session.user,
          id: token.sub!,
          role: token.role as string,
          studentId: token.studentId as string,
          position: token.position as string,
          experience: token.experience as string,
          isVerified: token.isVerified as boolean,
        };

        // Debug logging
        console.log("Session callback - Token:", {
          sub: token.sub,
          role: token.role,
          studentId: token.studentId,
          position: token.position,
          experience: token.experience,
          isVerified: token.isVerified,
        });
        console.log("Session callback - Session user:", session.user);
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/unauthorized",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
