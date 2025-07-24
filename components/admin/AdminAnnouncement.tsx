import { useAnnouncements } from "@/hooks/useAnnouncements";
import { useState } from "react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import AnnouncementFormModal from "../admin-announcement/AnnouncementFormModal";
import AnnouncementTable from "../admin-announcement/AnnouncementTable";
import AnnouncementFilters from "../admin-announcement/AnnouncementFilters";
import { Announcement } from "@/types/admin";
import { useNotification } from "@/context/NotificationContext";

export default function AdminAnnouncement() {
  const {
    announcements,
    loading,
    addAnnouncement,
    deleteAnnouncement,
    updateAnnouncement,
    togglePublish,
  } = useAnnouncements();
  const { notify } = useNotification();
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
      notify("success", "Announcement created!");
      setCreateOpen(false);
      setNewForm({
        title: "",
        content: "",
        priority: "medium",
        isPublished: false,
      });
    } else {
      notify("error", result.error || "Unknown error");
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
      notify("success", "Announcement updated!");
      setEditOpen(false);
      setEditId(null);
    } else {
      notify("error", result.error || "Unknown error");
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
      notify("success", "Announcement deleted!");
    } else {
      notify("error", result.error || "Unknown error");
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-8">
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
