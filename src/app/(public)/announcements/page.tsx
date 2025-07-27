"use client";

import { Container } from "@shared/components/ui/Container";
import { PageHeader } from "@shared/components/layout/PageHeader";
import { usePublicAnnouncements } from "@shared/hooks/usePublicAnnouncements";
import { AnnouncementList } from "@features/announcements/components/AnnouncementList";
import { AnnouncementEmptyState } from "@features/announcements/components/AnnouncementEmptyState";
import { AnnouncementErrorState } from "@features/announcements/components/AnnouncementErrorState";
import { AnnouncementLoadingState } from "@features/announcements/components/AnnouncementLoadingState";

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
