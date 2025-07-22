import type { Session, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/db/mongodb";
import dbConnect from "@/lib/db/mongoose";
import UserModel from "@/lib/db/models/user";
import bcrypt from "bcryptjs";
import type { JWT } from "next-auth/jwt";
import { DefaultSession } from "next-auth";
import NextAuth from "next-auth";

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

          const dbUser = await UserModel.findOne({ email: credentials.email });

          if (!dbUser) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            dbUser.password
          );

          if (!isPasswordValid) {
            return null;
          }

          const userData = {
            id: dbUser._id.toString(),
            email: dbUser.email,
            name: dbUser.name,
            role: dbUser.role,
            studentId: dbUser.studentId,
            position: dbUser.position,
            experience: dbUser.experience,
            isVerified: dbUser.isVerified,
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
    async jwt({ token, user }: { token: JWT; user?: User }) {
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
    async session({ session, token }: { session: Session; token: JWT }) {
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
