import type { Announcement } from "@/types/announcement";
import { AnnouncementCard } from "./AnnouncementCard";

export function AnnouncementList({
  announcements,
}: {
  announcements: Announcement[];
}) {
  return (
    <div className="grid gap-6">
      {announcements.map((announcement) => (
        <AnnouncementCard key={announcement._id} announcement={announcement} />
      ))}
    </div>
  );
}
