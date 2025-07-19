"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

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
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    priority: "medium" as "low" | "medium" | "high",
    isPublished: false,
  });

  const [editingAnnouncement, setEditingAnnouncement] =
    useState<Announcement | null>(null);
  const [editAnnouncementForm, setEditAnnouncementForm] = useState({
    title: "",
    content: "",
    priority: "medium" as "low" | "medium" | "high",
    isPublished: false,
  });

  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    type: "practice" as "practice" | "tournament" | "social" | "training",
    startDate: "",
    endDate: "",
    location: "",
    maxParticipants: "",
    registrationDeadline: "",
    isPublic: true,
  });

  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [editEventForm, setEditEventForm] = useState({
    title: "",
    description: "",
    type: "practice" as "practice" | "tournament" | "social" | "training",
    startDate: "",
    endDate: "",
    location: "",
    maxParticipants: "",
    registrationDeadline: "",
    isPublic: true,
  });

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

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
    } catch (error) {
      addNotification("error", "Failed to fetch data");
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

  const addAnnouncement = async () => {
    if (newAnnouncement.title && newAnnouncement.content) {
      try {
        const response = await fetch("/api/announcements", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...newAnnouncement,
            author: session?.user?.name || session?.user?.email || "Admin",
          }),
        });

        if (response.ok) {
          const announcement = await response.json();
          setAnnouncements([announcement, ...announcements]);
          setNewAnnouncement({
            title: "",
            content: "",
            priority: "medium",
            isPublished: false,
          });
          addNotification("success", "Announcement created successfully");
        } else {
          const error = await response.json();
          addNotification(
            "error",
            error.error || "Failed to create announcement"
          );
        }
      } catch (error) {
        addNotification("error", "Network error while creating announcement");
      }
    }
  };

  const addEvent = async () => {
    if (newEvent.title && newEvent.startDate && newEvent.location) {
      try {
        const response = await fetch("/api/events", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...newEvent,
            maxParticipants: newEvent.maxParticipants
              ? parseInt(newEvent.maxParticipants)
              : undefined,
            registrationDeadline: newEvent.registrationDeadline || undefined,
          }),
        });

        if (response.ok) {
          const event = await response.json();
          setEvents([event, ...events]);
          setNewEvent({
            title: "",
            description: "",
            type: "practice",
            startDate: "",
            endDate: "",
            location: "",
            maxParticipants: "",
            registrationDeadline: "",
            isPublic: true,
          });
          addNotification("success", "Event created successfully");
        } else {
          const error = await response.json();
          addNotification("error", error.error || "Failed to create event");
        }
      } catch (error) {
        addNotification("error", "Network error while creating event");
      }
    }
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
      addNotification("error", "Network error while deleting announcement");
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
      addNotification("error", "Network error while deleting event");
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
      addNotification("error", "Network error while updating announcement");
    }
  };

  const startEditAnnouncement = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setEditAnnouncementForm({
      title: announcement.title,
      content: announcement.content,
      priority: announcement.priority,
      isPublished: announcement.isPublished,
    });
  };

  const cancelEditAnnouncement = () => {
    setEditingAnnouncement(null);
    setEditAnnouncementForm({
      title: "",
      content: "",
      priority: "medium",
      isPublished: false,
    });
  };

  const updateAnnouncement = async () => {
    if (!editingAnnouncement) return;

    try {
      const response = await fetch(
        `/api/announcements/${editingAnnouncement._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editAnnouncementForm),
        }
      );

      if (response.ok) {
        const updatedAnnouncement = await response.json();
        setAnnouncements(
          announcements.map((a) =>
            a._id === editingAnnouncement._id
              ? updatedAnnouncement.announcement
              : a
          )
        );
        addNotification("success", "Announcement updated successfully");
        cancelEditAnnouncement();
      } else {
        const error = await response.json();
        addNotification(
          "error",
          error.error || "Failed to update announcement"
        );
      }
    } catch (error) {
      addNotification("error", "Network error while updating announcement");
    }
  };

  const startEditEvent = (event: Event) => {
    setEditingEvent(event);
    setEditEventForm({
      title: event.title,
      description: event.description,
      type: event.type,
      startDate:
        event.startDate.split("T")[0] +
        "T" +
        event.startDate.split("T")[1]?.substring(0, 5),
      endDate:
        event.endDate.split("T")[0] +
        "T" +
        event.endDate.split("T")[1]?.substring(0, 5),
      location: event.location,
      maxParticipants: event.maxParticipants?.toString() || "",
      registrationDeadline: event.registrationDeadline
        ? event.registrationDeadline.split("T")[0] +
          "T" +
          event.registrationDeadline.split("T")[1]?.substring(0, 5)
        : "",
      isPublic: event.isPublic,
    });
  };

  const cancelEditEvent = () => {
    setEditingEvent(null);
    setEditEventForm({
      title: "",
      description: "",
      type: "practice",
      startDate: "",
      endDate: "",
      location: "",
      maxParticipants: "",
      registrationDeadline: "",
      isPublic: true,
    });
  };

  const updateEvent = async () => {
    if (!editingEvent) return;

    try {
      const response = await fetch(`/api/events/${editingEvent._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...editEventForm,
          maxParticipants: editEventForm.maxParticipants
            ? parseInt(editEventForm.maxParticipants)
            : undefined,
          registrationDeadline: editEventForm.registrationDeadline || undefined,
        }),
      });

      if (response.ok) {
        const updatedEvent = await response.json();
        setEvents(
          events.map((e) =>
            e._id === editingEvent._id ? updatedEvent.event : e
          )
        );
        addNotification("success", "Event updated successfully");
        cancelEditEvent();
      } else {
        const error = await response.json();
        addNotification("error", error.error || "Failed to update event");
      }
    } catch (error) {
      addNotification("error", "Network error while updating event");
    }
  };

  const stats = {
    totalPlayers: 45,
    upcomingEvents: events.filter((e) => e.status === "upcoming").length,
    publishedAnnouncements: announcements.filter((a) => a.isPublished).length,
    alumni: 156,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Notifications */}
        {notifications.length > 0 && (
          <div className="fixed top-4 right-4 z-50 space-y-2">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`px-4 py-3 rounded-md shadow-lg ${
                  notification.type === "success"
                    ? "bg-green-500 text-white"
                    : notification.type === "error"
                    ? "bg-red-500 text-white"
                    : "bg-blue-500 text-white"
                }`}
              >
                {notification.message}
              </div>
            ))}
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Manage your ultimate frisbee club operations
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "dashboard"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab("announcements")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "announcements"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Announcements
            </button>
            <button
              onClick={() => setActiveTab("events")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "events"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Events
            </button>
          </nav>
        </div>

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Total Players
                </h3>
                <p className="text-3xl font-bold text-blue-600">
                  {stats.totalPlayers}
                </p>
                <p className="text-sm text-gray-500">Active members</p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Upcoming Events
                </h3>
                <p className="text-3xl font-bold text-green-600">
                  {stats.upcomingEvents}
                </p>
                <p className="text-sm text-gray-500">This month</p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Announcements
                </h3>
                <p className="text-3xl font-bold text-yellow-600">
                  {stats.publishedAnnouncements}
                </p>
                <p className="text-sm text-gray-500">Published</p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900">Alumni</h3>
                <p className="text-3xl font-bold text-purple-600">
                  {stats.alumni}
                </p>
                <p className="text-sm text-gray-500">Network size</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <button
                    onClick={() => setActiveTab("announcements")}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                  >
                    Create Announcement
                  </button>
                  <button
                    onClick={() => setActiveTab("events")}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
                  >
                    Add New Event
                  </button>
                  <Link
                    href="/roster"
                    className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 block text-center"
                  >
                    Manage Players
                  </Link>
                  <button className="w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700">
                    View Reports
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">
                        New player registered
                      </p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Event created</p>
                      <p className="text-xs text-gray-500">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">
                        Announcement published
                      </p>
                      <p className="text-xs text-gray-500">2 days ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Announcements Tab */}
        {activeTab === "announcements" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">
                Create New Announcement
              </h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Announcement title"
                  value={newAnnouncement.title}
                  onChange={(e) =>
                    setNewAnnouncement({
                      ...newAnnouncement,
                      title: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  placeholder="Announcement content"
                  value={newAnnouncement.content}
                  onChange={(e) =>
                    setNewAnnouncement({
                      ...newAnnouncement,
                      content: e.target.value,
                    })
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex space-x-4">
                  <select
                    value={newAnnouncement.priority}
                    onChange={(e) =>
                      setNewAnnouncement({
                        ...newAnnouncement,
                        priority: e.target.value as "low" | "medium" | "high",
                      })
                    }
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newAnnouncement.isPublished}
                      onChange={(e) =>
                        setNewAnnouncement({
                          ...newAnnouncement,
                          isPublished: e.target.checked,
                        })
                      }
                      className="mr-2"
                    />
                    Publish immediately
                  </label>
                </div>
                <button
                  onClick={addAnnouncement}
                  className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                >
                  Create Announcement
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">
                Manage Announcements
              </h2>

              {/* Edit Announcement Form */}
              {editingAnnouncement && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-semibold mb-4 text-blue-900">
                    Edit Announcement
                  </h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Announcement title"
                      value={editAnnouncementForm.title}
                      onChange={(e) =>
                        setEditAnnouncementForm({
                          ...editAnnouncementForm,
                          title: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <textarea
                      placeholder="Announcement content"
                      value={editAnnouncementForm.content}
                      onChange={(e) =>
                        setEditAnnouncementForm({
                          ...editAnnouncementForm,
                          content: e.target.value,
                        })
                      }
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex space-x-4">
                      <select
                        value={editAnnouncementForm.priority}
                        onChange={(e) =>
                          setEditAnnouncementForm({
                            ...editAnnouncementForm,
                            priority: e.target.value as
                              | "low"
                              | "medium"
                              | "high",
                          })
                        }
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="low">Low Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="high">High Priority</option>
                      </select>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={editAnnouncementForm.isPublished}
                          onChange={(e) =>
                            setEditAnnouncementForm({
                              ...editAnnouncementForm,
                              isPublished: e.target.checked,
                            })
                          }
                          className="mr-2"
                        />
                        Publish immediately
                      </label>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={updateAnnouncement}
                        className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                      >
                        Update Announcement
                      </button>
                      <button
                        onClick={cancelEditAnnouncement}
                        className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {announcements.length === 0 ? (
                  <p className="text-gray-500">No announcements found.</p>
                ) : (
                  announcements.map((announcement) => (
                    <div
                      key={announcement._id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold">
                            {announcement.title}
                          </h3>
                          <p className="text-gray-600 text-sm mt-1">
                            {announcement.content}
                          </p>
                          <div className="flex space-x-4 mt-2 text-xs text-gray-500">
                            <span>By: {announcement.author}</span>
                            <span>Priority: {announcement.priority}</span>
                            <span>
                              Created:{" "}
                              {new Date(
                                announcement.createdAt
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => startEditAnnouncement(announcement)}
                            className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs hover:bg-blue-200"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() =>
                              toggleAnnouncementPublish(announcement._id)
                            }
                            className={`px-2 py-1 rounded text-xs ${
                              announcement.isPublished
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {announcement.isPublished ? "Published" : "Draft"}
                          </button>
                          <button
                            onClick={() => deleteAnnouncement(announcement._id)}
                            className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs hover:bg-red-200"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === "events" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Create New Event</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Event title"
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={newEvent.type}
                  onChange={(e) =>
                    setNewEvent({
                      ...newEvent,
                      type: e.target.value as
                        | "practice"
                        | "tournament"
                        | "social"
                        | "training",
                    })
                  }
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="practice">Practice</option>
                  <option value="tournament">Tournament</option>
                  <option value="social">Social</option>
                  <option value="training">Training</option>
                </select>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Start Time *
                  </label>
                  <input
                    type="datetime-local"
                    value={newEvent.startDate}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, startDate: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event End Time
                  </label>
                  <input
                    type="datetime-local"
                    value={newEvent.endDate}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, endDate: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Location"
                  value={newEvent.location}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, location: e.target.value })
                  }
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Max participants (optional)"
                  value={newEvent.maxParticipants}
                  onChange={(e) =>
                    setNewEvent({
                      ...newEvent,
                      maxParticipants: e.target.value,
                    })
                  }
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Registration Deadline (optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={newEvent.registrationDeadline}
                    onChange={(e) =>
                      setNewEvent({
                        ...newEvent,
                        registrationDeadline: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newEvent.isPublic}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, isPublic: e.target.checked })
                    }
                    className="mr-2"
                  />
                  Public event
                </label>
              </div>
              <textarea
                placeholder="Event description"
                value={newEvent.description}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, description: e.target.value })
                }
                rows={3}
                className="w-full mt-4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={addEvent}
                className="mt-4 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
              >
                Create Event
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Manage Events</h2>

              {/* Edit Event Form */}
              {editingEvent && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-semibold mb-4 text-green-900">
                    Edit Event
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Event title"
                      value={editEventForm.title}
                      onChange={(e) =>
                        setEditEventForm({
                          ...editEventForm,
                          title: e.target.value,
                        })
                      }
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                      value={editEventForm.type}
                      onChange={(e) =>
                        setEditEventForm({
                          ...editEventForm,
                          type: e.target.value as
                            | "practice"
                            | "tournament"
                            | "social"
                            | "training",
                        })
                      }
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="practice">Practice</option>
                      <option value="tournament">Tournament</option>
                      <option value="social">Social</option>
                      <option value="training">Training</option>
                    </select>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Event Start Time *
                      </label>
                      <input
                        type="datetime-local"
                        value={editEventForm.startDate}
                        onChange={(e) =>
                          setEditEventForm({
                            ...editEventForm,
                            startDate: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Event End Time
                      </label>
                      <input
                        type="datetime-local"
                        value={editEventForm.endDate}
                        onChange={(e) =>
                          setEditEventForm({
                            ...editEventForm,
                            endDate: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Location"
                      value={editEventForm.location}
                      onChange={(e) =>
                        setEditEventForm({
                          ...editEventForm,
                          location: e.target.value,
                        })
                      }
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="Max participants (optional)"
                      value={editEventForm.maxParticipants}
                      onChange={(e) =>
                        setEditEventForm({
                          ...editEventForm,
                          maxParticipants: e.target.value,
                        })
                      }
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Registration Deadline (optional)
                      </label>
                      <input
                        type="datetime-local"
                        value={editEventForm.registrationDeadline}
                        onChange={(e) =>
                          setEditEventForm({
                            ...editEventForm,
                            registrationDeadline: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={editEventForm.isPublic}
                        onChange={(e) =>
                          setEditEventForm({
                            ...editEventForm,
                            isPublic: e.target.checked,
                          })
                        }
                        className="mr-2"
                      />
                      Public event
                    </label>
                  </div>
                  <textarea
                    placeholder="Event description"
                    value={editEventForm.description}
                    onChange={(e) =>
                      setEditEventForm({
                        ...editEventForm,
                        description: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full mt-4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex space-x-2 mt-4">
                    <button
                      onClick={updateEvent}
                      className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
                    >
                      Update Event
                    </button>
                    <button
                      onClick={cancelEditEvent}
                      className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {events.length === 0 ? (
                  <p className="text-gray-500">No events found.</p>
                ) : (
                  events.map((event) => (
                    <div
                      key={event._id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold">{event.title}</h3>
                          {event.description && (
                            <p className="text-gray-600 text-sm mt-1">
                              {event.description}
                            </p>
                          )}
                          <div className="flex space-x-4 mt-2 text-sm text-gray-600">
                            <span>Type: {event.type}</span>
                            <span>
                              Date:{" "}
                              {new Date(event.startDate).toLocaleDateString()}
                            </span>
                            <span>Location: {event.location}</span>
                            <span>Status: {event.status}</span>
                            <span>
                              Participants: {event.currentParticipants}/
                              {event.maxParticipants || "∞"}
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => startEditEvent(event)}
                            className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs hover:bg-blue-200"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteEvent(event._id)}
                            className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs hover:bg-red-200"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
