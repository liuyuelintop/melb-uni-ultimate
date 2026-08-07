import { redirect } from "next/navigation";
import { getViewer } from "@shared/lib/auth/guards";

/**
 * Authoritative server-side gate for every route in the (admin) group.
 *
 * Route groups are a filesystem convention only — the parentheses do not appear
 * in the URL and confer no protection, so the admin dashboard is served at
 * /dashboard. `src/middleware.ts` also checks the JWT for that path, but this
 * layout is the gate that decides: it runs on the server for every request in
 * the group and reads the caller's role from the database rather than from the
 * token, so revoking an admin takes effect immediately.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const viewer = await getViewer();

  if (!viewer) {
    redirect("/login");
  }

  if (viewer.role !== "admin") {
    redirect("/unauthorized");
  }

  return <>{children}</>;
}
