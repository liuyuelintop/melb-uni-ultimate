import type { Announcement } from "@/types/announcement";
import { AnnouncementDetailHeader } from "@/components/public-announcements/AnnouncementDetailHeader";
import { AnnouncementDetailContent } from "@/components/public-announcements/AnnouncementDetailContent";
import { AnnouncementDetailActions } from "@/components/public-announcements/AnnouncementDetailActions";

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
