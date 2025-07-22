import React, { useState, useMemo } from "react";
import { Announcement, Notification } from "../../types/admin";
import AnnouncementTable from "./AnnouncementTable";
import AnnouncementFilters from "./AnnouncementFilters";
import AnnouncementFormModal from "./AnnouncementFormModal";
import NotificationComponent from "../ui/Notification";
import type { AnnouncementFormProps } from "./AnnouncementForm";

interface AnnouncementManagerProps {
  announcements: Announcement[];
  onAdd: (form: AnnouncementFormProps["form"]) => Promise<void>;
  onEdit: (id: string, form: AnnouncementFormProps["form"]) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onTogglePublish: (id: string) => Promise<void>;
  notifications: Notification[];
  onNotificationClose: (id: string) => void;
}

const defaultForm = {
  title: "",
  content: "",
  priority: "medium" as "low" | "medium" | "high",
  isPublished: false,
};

const AnnouncementManager: React.FC<AnnouncementManagerProps> = ({
  announcements,
  onAdd,
  onEdit,
  onDelete,
  onTogglePublish,
  notifications,
  onNotificationClose,
}) => {
  // Modal state
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState(defaultForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [newForm, setNewForm] = useState(defaultForm);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Filtered announcements
  const filtered = useMemo(
    () =>
      announcements.filter((a) => {
        const matchesSearch =
          a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.author.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPriority =
          filterPriority === "all" || a.priority === filterPriority;
        const matchesStatus =
          filterStatus === "all" ||
          (filterStatus === "published" && a.isPublished) ||
          (filterStatus === "draft" && !a.isPublished);
        return matchesSearch && matchesPriority && matchesStatus;
      }),
    [announcements, searchTerm, filterPriority, filterStatus]
  );

  // Handlers
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAdd(newForm);
    setNewForm(defaultForm);
    setCreateOpen(false);
  };
  const handleEdit = (a: Announcement) => {
    setEditForm({
      title: a.title,
      content: a.content,
      priority: a.priority,
      isPublished: a.isPublished, // ensure this is loaded
    });
    setEditId(a._id);
    setEditOpen(true);
  };
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      await onEdit(editId, editForm);
      setEditOpen(false);
      setEditId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this announcement? This action cannot be undone."
      )
    ) {
      await onDelete(id);
    }
  };

  return (
    <div className="space-y-8">
      {notifications.length > 0 && (
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {notifications.map((notification) => (
            <NotificationComponent
              key={notification.id}
              type={notification.type}
              message={notification.message}
              onClose={() => onNotificationClose(notification.id)}
            />
          ))}
        </div>
      )}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-bold">Announcements</h2>
        <button
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          onClick={() => setCreateOpen(true)}
        >
          + New Announcement
        </button>
      </div>
      <AnnouncementFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterPriority={filterPriority}
        setFilterPriority={setFilterPriority}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
      />
      <AnnouncementTable
        announcements={filtered}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <AnnouncementFormModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        form={newForm}
        setForm={setNewForm}
        handleSubmit={handleCreate}
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
};

export default AnnouncementManager;
