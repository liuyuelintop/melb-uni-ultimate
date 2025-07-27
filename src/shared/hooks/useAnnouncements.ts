import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { useCrud } from "./useCrud";
import { Announcement } from "@shared/types/admin";

export function useAnnouncements() {
  const { data: session } = useSession();

  const authorValue = useMemo(
    () => session?.user?.name || session?.user?.email || "Admin",
    [session?.user?.name, session?.user?.email]
  );

  return useCrud<Announcement>("/api/announcements", {
    authorField: "author",
    authorValue,
    publishField: "isPublished",
  });
}
