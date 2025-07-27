import { useDetail } from "./useDetail";
import type { Announcement } from "@shared/types/announcement";

export function useAnnouncementDetail(id: string | undefined) {
  return useDetail<Announcement>(id, "/api/announcements");
}
