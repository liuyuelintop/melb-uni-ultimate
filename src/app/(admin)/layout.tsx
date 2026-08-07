import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@app/api/auth/[...nextauth]/route";

/**
 * Authoritative server-side gate for every route in the (admin) group.
 *
 * Middleware alone is not sufficient here: it can only inspect the JWT cookie,
 * and its path matching silently drifted out of sync with the routes it was
 * meant to protect (it tested "/admin", but route groups are URL-invisible so
 * the dashboard is served at /dashboard). Checking on the server, inside the
 * segment being protected, cannot drift that way.
 *
 * `authOptions` MUST be passed. Calling getServerSession() without it makes
 * NextAuth fall back to its default session callback, which returns a valid
 * session with `role` undefined — so a role check would silently reject
 * everyone, including real admins.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (session.user?.role !== "admin") {
    redirect("/unauthorized");
  }

  return <>{children}</>;
}
