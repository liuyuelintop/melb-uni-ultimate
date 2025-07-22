import { useAnnouncements } from "@/hooks/useAnnouncements";
import { useState } from "react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import NotificationComponent from "../ui/Notification";
import AnnouncementFormModal from "./AnnouncementFormModal";
import AnnouncementTable from "./AnnouncementTable";
import AnnouncementFilters from "./AnnouncementFilters";
import { Notification } from "@/types/admin";
import { Announcement } from "@/types/admin";

export default function AnnouncementManager() {
  const {
    announcements,
    loading,
    addAnnouncement,
    deleteAnnouncement,
    updateAnnouncement,
    togglePublish,
  } = useAnnouncements();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [newForm, setNewForm] = useState({
    title: "",
    content: "",
    priority: "medium" as "low" | "medium" | "high",
    isPublished: false,
  });
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    content: "",
    priority: "medium" as "low" | "medium" | "high",
    isPublished: false,
  });
  const [editId, setEditId] = useState<string | null>(null);

  const handleAddSubmit = async (formData: typeof newForm) => {
    const result = await addAnnouncement(formData);
    if (result.success) {
      setNotifications((prev) => [
        ...prev,
        {
          type: "success",
          message: "Announcement created!",
          id: Date.now().toString(),
        },
      ]);
      setCreateOpen(false);
      setNewForm({
        title: "",
        content: "",
        priority: "medium",
        isPublished: false,
      });
    } else {
      setNotifications((prev) => [
        ...prev,
        {
          type: "error",
          message: result.error || "Unknown error",
          id: Date.now().toString(),
        },
      ]);
    }
  };

  const handleEdit = (announcement: Announcement) => {
    setEditForm({
      title: announcement.title,
      content: announcement.content,
      priority: announcement.priority,
      isPublished: announcement.isPublished,
    });
    setEditId(announcement._id);
    setEditOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editId) return;
    const result = await updateAnnouncement(editId, editForm);
    if (result.success) {
      setNotifications((prev) => [
        ...prev,
        {
          type: "success",
          message: "Announcement updated!",
          id: Date.now().toString(),
        },
      ]);
      setEditOpen(false);
      setEditId(null);
    } else {
      setNotifications((prev) => [
        ...prev,
        {
          type: "error",
          message: result.error || "Unknown error",
          id: Date.now().toString(),
        },
      ]);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this announcement? This action cannot be undone."
      )
    )
      return;
    const result = await deleteAnnouncement(id);
    if (result.success) {
      setNotifications((prev) => [
        ...prev,
        {
          type: "success",
          message: "Announcement deleted!",
          id: Date.now().toString(),
        },
      ]);
    } else {
      setNotifications((prev) => [
        ...prev,
        {
          type: "error",
          message: result.error || "Unknown error",
          id: Date.now().toString(),
        },
      ]);
    }
  };

  const handleNotificationClose = (id: string) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id));

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-8">
      {notifications.length > 0 && (
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {notifications.map((notification) => (
            <NotificationComponent
              key={notification.id}
              type={notification.type}
              message={notification.message}
              onClose={() => handleNotificationClose(notification.id)}
            />
          ))}
        </div>
      )}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-bold">Announcements</h2>
        <button
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2.5 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
          onClick={() => setCreateOpen(true)}
        >
          New Announcement
        </button>
      </div>
      <AnnouncementFilters
        searchTerm={""}
        setSearchTerm={() => {}}
        filterPriority={"all"}
        setFilterPriority={() => {}}
        filterStatus={"all"}
        setFilterStatus={() => {}}
      />
      <AnnouncementTable
        announcements={announcements}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <AnnouncementFormModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        form={newForm}
        setForm={setNewForm}
        handleSubmit={(e) => {
          e.preventDefault();
          handleAddSubmit(newForm);
        }}
        modalTitle="Create Announcement"
        submitText="Create"
      />
      <AnnouncementFormModal
        open={editOpen}
        onOpenChange={setEditOpen}
        form={editForm}
        setForm={setEditForm}
        handleSubmit={handleEditSubmit}
        modalTitle="Edit Announcement"
        submitText="Save"
      />
    </div>
  );
}
