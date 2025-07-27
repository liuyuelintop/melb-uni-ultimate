"use client";

import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { usePublicAnnouncements } from "@/hooks/usePublicAnnouncements";
import { AnnouncementList } from "@/components/public-announcements/AnnouncementList";
import { AnnouncementEmptyState } from "@/components/public-announcements/AnnouncementEmptyState";
import { AnnouncementErrorState } from "@/components/public-announcements/AnnouncementErrorState";
import { AnnouncementLoadingState } from "@/components/public-announcements/AnnouncementLoadingState";

export default function AnnouncementsPage() {
  const { data: announcements, loading, error } = usePublicAnnouncements();

  return (
    <Container>
      <div className="py-8">
        <PageHeader title="Club Announcements" />
        {loading ? (
          <AnnouncementLoadingState />
        ) : error ? (
          <AnnouncementErrorState message={error} />
        ) : announcements.length === 0 ? (
          <AnnouncementEmptyState />
        ) : (
          <AnnouncementList announcements={announcements} />
        )}
      </div>
    </Container>
  );
}
