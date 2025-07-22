import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Announcement } from "@/types/admin";

export function useAnnouncements() {
  const { data: session } = useSession();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnnouncements() {
      setLoading(true);
      try {
        const res = await fetch("/api/announcements");
        if (res.ok) setAnnouncements(await res.json());
      } catch (error) {
        // Optionally handle error
      } finally {
        setLoading(false);
      }
    }
    fetchAnnouncements();
  }, []);

  const addAnnouncement = async (
    form: Omit<Announcement, "_id" | "author" | "createdAt">
  ) => {
    const response = await fetch("/api/announcements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        author: session?.user?.name || session?.user?.email || "Admin",
      }),
    });
    if (response.ok) {
      const newAnnouncement = await response.json();
      setAnnouncements((prev) => [newAnnouncement, ...prev]);
      return { success: true };
    }
    return { success: false, error: "Failed to create announcement" };
  };

  const deleteAnnouncement = async (id: string) => {
    const response = await fetch(`/api/announcements/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      setAnnouncements((prev) => prev.filter((a) => a._id !== id));
      return { success: true };
    }
    return { success: false, error: "Failed to delete announcement" };
  };

  const updateAnnouncement = async (
    id: string,
    form: Omit<Announcement, "_id" | "author" | "createdAt">
  ) => {
    const response = await fetch(`/api/announcements/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (response.ok) {
      const updatedAnnouncement = await response.json();
      setAnnouncements((prev) =>
        prev.map((a) => (a._id === id ? updatedAnnouncement.announcement : a))
      );
      return { success: true };
    }
    return { success: false, error: "Failed to update announcement" };
  };

  const togglePublish = async (id: string) => {
    const announcement = announcements.find((a) => a._id === id);
    if (!announcement)
      return { success: false, error: "Announcement not found" };
    const response = await fetch(`/api/announcements/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished: !announcement.isPublished }),
    });
    if (response.ok) {
      setAnnouncements((prev) =>
        prev.map((a) =>
          a._id === id ? { ...a, isPublished: !a.isPublished } : a
        )
      );
      return { success: true };
    }
    return { success: false, error: "Failed to update publish status" };
  };

  return {
    announcements,
    loading,
    addAnnouncement,
    deleteAnnouncement,
    updateAnnouncement,
    togglePublish,
  };
}
