"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import AdminPageLayout from "@/components/admin/AdminPageLayout";
import Dashboard from "@/components/admin/Dashboard";
import AnnouncementManager from "@/components/announcement/AnnouncementManager";
import EventManager from "@/components/event/EventManager";

interface Announcement {
  _id: string;
  title: string;
  content: string;
  author: string;
  priority: "low" | "medium" | "high";
  isPublished: boolean;
  createdAt: string;
}

interface Event {
  _id: string;
  title: string;
  description: string;
  type: "practice" | "tournament" | "social" | "training";
  startDate: string;
  endDate: string;
  location: string;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  currentParticipants: number;
  maxParticipants?: number;
  registrationDeadline?: string;
  isPublic: boolean;
}

interface Notification {
  type: "success" | "error" | "info";
  message: string;
  id: string;
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState("dashboard");
  // --- Announcement state/logic ---
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  // --- Event state/logic ---
  const [events, setEvents] = useState<Event[]>([]);
  // --- Notifications ---
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [totalPlayers, setTotalPlayers] = useState(0);
  const [totalAlumni, setTotalAlumni] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch data on component mount
  useEffect(() => {
    if (session && session.user?.role === "admin") {
      fetchData();
    }
  }, [session]);

  // Check authentication and admin role
  if (status === "loading") {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-6">
            You must be logged in to access the admin panel.
          </p>
          <Link
            href="/login"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (session.user?.role !== "admin") {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-6">
            You must have admin privileges to access this page.
          </p>
          <Link
            href="/"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch announcements
      const announcementsResponse = await fetch("/api/announcements");
      if (announcementsResponse.ok) {
        const announcementsData = await announcementsResponse.json();
        setAnnouncements(announcementsData);
      }

      // Fetch events
      const eventsResponse = await fetch("/api/events");
      if (eventsResponse.ok) {
        const eventsData = await eventsResponse.json();
        setEvents(eventsData);
      }

      // Fetch players count
      const playersResponse = await fetch("/api/players?isActive=true");
      if (playersResponse.ok) {
        const playersData = await playersResponse.json();
        setTotalPlayers(playersData.length);
      }

      // Fetch alumni count
      const alumniResponse = await fetch("/api/alumni?isActive=true");
      if (alumniResponse.ok) {
        const alumniData = await alumniResponse.json();
        setTotalAlumni(alumniData.length);
      }
    } catch (error) {
      addNotification("error", `Failed to fetch data: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const addNotification = (
    type: "success" | "error" | "info",
    message: string
  ) => {
    const id = Date.now().toString();
    setNotifications((prev) => [...prev, { type, message, id }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  };

  const deleteAnnouncement = async (id: string) => {
    try {
      const response = await fetch(`/api/announcements/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setAnnouncements(announcements.filter((a) => a._id !== id));
        addNotification("success", "Announcement deleted successfully");
      } else {
        addNotification("error", "Failed to delete announcement");
      }
    } catch (error) {
      addNotification(
        "error",
        `Network error while deleting announcement: ${error}`
      );
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      const response = await fetch(`/api/events/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setEvents(events.filter((e) => e._id !== id));
        addNotification("success", "Event deleted successfully");
      } else {
        addNotification("error", "Failed to delete event");
      }
    } catch (error) {
      addNotification("error", `Network error while deleting event:: ${error}`);
    }
  };

  const toggleAnnouncementPublish = async (id: string) => {
    try {
      const announcement = announcements.find((a) => a._id === id);
      if (!announcement) return;

      const response = await fetch(`/api/announcements/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isPublished: !announcement.isPublished,
        }),
      });

      if (response.ok) {
        setAnnouncements(
          announcements.map((a) =>
            a._id === id ? { ...a, isPublished: !a.isPublished } : a
          )
        );
        addNotification(
          "success",
          `Announcement ${
            announcement.isPublished ? "unpublished" : "published"
          } successfully`
        );
      } else {
        addNotification("error", "Failed to update announcement status");
      }
    } catch (error) {
      addNotification(
        "error",
        `Network error while updating announcement: : ${error}`
      );
    }
  };

  // --- Notification handler ---
  const handleNotificationClose = (id: string) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id));

  // --- Stats ---
  const stats = {
    totalPlayers,
    upcomingEvents: events.filter((e) => e.status === "upcoming").length,
    publishedAnnouncements: announcements.filter((a) => a.isPublished).length,
    alumni: totalAlumni,
  };

  // Lazy load admin management components
  const AdminPlayers = dynamic(
    () => import("@/components/admin/AdminPlayers"),
    { ssr: false }
  );
  const AdminAlumni = dynamic(() => import("@/components/admin/AdminAlumni"), {
    ssr: false,
  });
  const AdminTournaments = dynamic(
    () => import("@/components/admin/AdminTournaments"),
    { ssr: false }
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  const addAnnouncement = async (form: {
    title: string;
    content: string;
    priority: "low" | "medium" | "high";
    isPublished: boolean;
  }) => {
    try {
      const response = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          author: session?.user?.name || session?.user?.email || "Admin",
        }),
      });
      if (response.ok) {
        const announcement = await response.json();
        setAnnouncements((prev) => [announcement, ...prev]);
        addNotification("success", "Announcement created successfully");
      } else {
        const error = await response.json();
        addNotification(
          "error",
          error.error || "Failed to create announcement"
        );
      }
    } catch (error) {
      addNotification(
        "error",
        `Network error while creating announcement: ${error}`
      );
    }
  };
  const addEvent = async (form: {
    title: string;
    description: string;
    type: "practice" | "tournament" | "social" | "training";
    startDate: string;
    endDate: string;
    location: string;
    maxParticipants: string;
    registrationDeadline: string;
    isPublic: boolean;
  }) => {
    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          maxParticipants: form.maxParticipants
            ? parseInt(form.maxParticipants)
            : undefined,
          registrationDeadline: form.registrationDeadline || undefined,
        }),
      });
      if (response.ok) {
        const event = await response.json();
        setEvents((prev) => [event, ...prev]);
        addNotification("success", "Event created successfully");
      } else {
        const error = await response.json();
        addNotification("error", error.error || "Failed to create event");
      }
    } catch (error) {
      addNotification("error", `Network error while creating event: ${error}`);
    }
  };

  const handleUpdateAnnouncement = async (
    id: string,
    form: {
      title: string;
      content: string;
      priority: "low" | "medium" | "high";
      isPublished: boolean;
    }
  ) => {
    try {
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
        addNotification("success", "Announcement updated successfully");
      } else {
        const error = await response.json();
        addNotification(
          "error",
          error.error || "Failed to update announcement"
        );
      }
    } catch (error) {
      addNotification(
        "error",
        `Network error while updating announcement: ${error}`
      );
    }
  };
  const handleUpdateEvent = async (
    id: string,
    form: {
      title: string;
      description: string;
      type: "practice" | "tournament" | "social" | "training";
      startDate: string;
      endDate: string;
      location: string;
      maxParticipants: string;
      registrationDeadline: string;
      isPublic: boolean;
    }
  ) => {
    try {
      const response = await fetch(`/api/events/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          maxParticipants: form.maxParticipants
            ? parseInt(form.maxParticipants)
            : undefined,
          registrationDeadline: form.registrationDeadline || undefined,
        }),
      });
      if (response.ok) {
        const updatedEvent = await response.json();
        setEvents((prev) =>
          prev.map((e) => (e._id === id ? updatedEvent.event : e))
        );
        addNotification("success", "Event updated successfully");
      } else {
        const error = await response.json();
        addNotification("error", error.error || "Failed to update event");
      }
    } catch (error) {
      addNotification("error", `Network error while updating event: ${error}`);
    }
  };

  return (
    <AdminPageLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === "dashboard" && <Dashboard stats={stats} />}
      {activeTab === "announcements" && (
        <AnnouncementManager
          announcements={announcements}
          onAdd={addAnnouncement}
          onEdit={handleUpdateAnnouncement}
          onDelete={deleteAnnouncement}
          onTogglePublish={toggleAnnouncementPublish}
          notifications={notifications}
          onNotificationClose={handleNotificationClose}
        />
      )}
      {activeTab === "events" && (
        <EventManager
          events={events}
          onAdd={addEvent}
          onEdit={handleUpdateEvent}
          onDelete={deleteEvent}
          notifications={notifications}
          onNotificationClose={handleNotificationClose}
        />
      )}
      {activeTab === "roster" && <AdminPlayers />}
      {activeTab === "alumni" && <AdminAlumni />}
      {activeTab === "tournaments" && <AdminTournaments />}
    </AdminPageLayout>
  );
}
