import type { Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";
import { DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@shared/lib/db/mongoose";
import UserModel from "@shared/lib/db/models/user";

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

/**
 * NextAuth configuration.
 *
 * This lives in `src/shared/lib/auth/` rather than in the `[...nextauth]` route
 * file for two reasons: a Next.js route module should export only HTTP handlers,
 * and the authorisation guards in `./guards.ts` need these options — importing
 * them from a route file risks a circular dependency.
 *
 * Every server-side session read MUST pass these options. `getServerSession()`
 * called without them silently falls back to NextAuth's default session
 * callback, which returns a valid session whose `user.role` is `undefined`.
 * That failure mode is invisible to TypeScript, because the options parameter
 * is optional. Use the helpers in `./guards.ts` instead of calling
 * `getServerSession` directly, so the options cannot be forgotten.
 */
export const authOptions = {
  // No adapter. NextAuth v4 uses one to persist sessions, link OAuth accounts
  // and store email verification tokens — none of which apply here: the session
  // strategy below is explicitly `jwt`, the only provider is credentials, and
  // `authorize` reads the user itself through Mongoose. The MongoDBAdapter that
  // used to sit here was therefore never exercised.
  //
  // It was also actively harmful. Constructing it called `client.connect()`
  // while this module was being imported, so simply importing the auth options
  // opened a database connection. `next build` imports every route module to
  // collect page data, and this module is reachable from all of them through
  // ./guards.ts — so a build would try to reach MongoDB, and a slow or
  // unreachable cluster could fail the build rather than a request.
  //
  // The `@auth/mongodb-adapter` package has since been uninstalled as well, not
  // just unwired. It was the only thing pulling `@auth/core` into the dependency
  // tree as a real dependency, where it carried critical advisories that this
  // app never had a code path to. Do not reinstall it to "restore" an adapter.
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

          return {
            id: dbUser._id.toString(),
            email: dbUser.email,
            name: dbUser.name,
            role: dbUser.role,
            studentId: dbUser.studentId,
            position: dbUser.position,
            experience: dbUser.experience,
            isVerified: dbUser.isVerified,
          };
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
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.sub!,
          role: token.role as string,
          studentId: token.studentId as string,
          position: token.position as string,
          experience: token.experience as string,
          isVerified: token.isVerified as boolean,
        };
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
