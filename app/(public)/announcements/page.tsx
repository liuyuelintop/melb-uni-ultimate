"use client";

import { useState, useEffect } from "react";
import {
  Container,
  LoadingSpinner,
  ErrorMessage,
  EmptyState,
} from "@/components/ui";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  AnnouncementCard,
  type Announcement,
} from "@/components/announcement/AnnouncementCard";

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/announcements?published=true");

      if (response.ok) {
        const data = await response.json();
        setAnnouncements(data);
      } else {
        setError("Failed to fetch announcements");
      }
    } catch (error) {
      setError("Network error while fetching announcements");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <div className="py-8">
          <PageHeader title="Club Announcements" />
          <LoadingSpinner text="Loading announcements..." />
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="py-8">
          <PageHeader title="Club Announcements" />
          <ErrorMessage message={error} />
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-8">
        <PageHeader title="Club Announcements" />

        {announcements.length === 0 ? (
          <EmptyState
            title="No announcements available at the moment."
            description="Check back later for updates!"
          />
        ) : (
          <div className="grid gap-6">
            {announcements.map((announcement) => (
              <AnnouncementCard
                key={announcement._id}
                announcement={announcement}
              />
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
