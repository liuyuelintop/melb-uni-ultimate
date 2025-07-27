import { useSession } from "next-auth/react";
import { useCrud } from "./useCrud";
import { Announcement } from "@/types/admin";

export function useAnnouncements() {
  const { data: session } = useSession();

  return useCrud<Announcement>("/api/announcements", {
    authorField: "author",
    authorValue: session?.user?.name || session?.user?.email || "Admin",
    publishField: "isPublished",
  });
}
