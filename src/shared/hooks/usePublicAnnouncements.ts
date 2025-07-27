import { useApi } from "./useApi";
import type { Announcement } from "@shared/types/announcement";

export function usePublicAnnouncements() {
  return useApi<Announcement[]>("/api/announcements?published=true");
}
