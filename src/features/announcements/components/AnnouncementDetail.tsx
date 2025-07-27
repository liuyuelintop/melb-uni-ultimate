import type { Announcement } from "@shared/types/announcement";
import { AnnouncementDetailHeader } from "@features/announcements/components/AnnouncementDetailHeader";
import { AnnouncementDetailContent } from "@features/announcements/components/AnnouncementDetailContent";
import { AnnouncementDetailActions } from "@features/announcements/components/AnnouncementDetailActions";

export function AnnouncementDetail({
  announcement,
}: {
  announcement: Announcement;
}) {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnnouncementDetailHeader announcement={announcement} />
        <AnnouncementDetailContent content={announcement.content} />
        <AnnouncementDetailActions />
      </div>
    </div>
  );
}
