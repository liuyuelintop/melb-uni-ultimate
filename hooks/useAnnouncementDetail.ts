import { useState, useEffect } from "react";
import type { Announcement } from "@/types/announcement";

export function useAnnouncementDetail(id: string | undefined) {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchAnnouncement = async () => {
      try {
        const response = await fetch(`/api/announcements/${id}`);
        if (!response.ok) throw new Error("Announcement not found");
        const data = await response.json();
        setAnnouncement(data.announcement);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load announcement"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncement();
  }, [id]);

  return { announcement, loading, error };
}
