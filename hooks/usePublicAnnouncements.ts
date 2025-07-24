import { useState, useEffect } from "react";
import type { Announcement } from "@/types/announcement";

export function usePublicAnnouncements() {
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

  return { announcements, loading, error };
}
