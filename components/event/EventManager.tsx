import React, { useState, useMemo } from "react";
import { Event, Notification } from "../../types/admin";
import EventTable from "./EventTable";
import EventFilters from "./EventFilters";
import EventFormModal from "./EventFormModal";
import NotificationComponent from "../ui/Notification";
import type { EventFormProps } from "./EventForm";

interface EventManagerProps {
  events: Event[];
  onAdd: (form: EventFormProps["form"]) => Promise<void>;
  onEdit: (id: string, form: EventFormProps["form"]) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  notifications: Notification[];
  onNotificationClose: (id: string) => void;
}

const defaultForm: EventFormProps["form"] = {
  title: "",
  description: "",
  type: "practice",
  startDate: "",
  endDate: "",
  location: "",
  maxParticipants: "",
  registrationDeadline: "",
  isPublic: true,
};

const EventManager: React.FC<EventManagerProps> = ({
  events,
  onAdd,
  onEdit,
  onDelete,
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
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Filtered events
  const filtered = useMemo(
    () =>
      events.filter((e) => {
        const matchesSearch =
          e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          e.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === "all" || e.type === filterType;
        const matchesStatus =
          filterStatus === "all" || e.status === filterStatus;
        return matchesSearch && matchesType && matchesStatus;
      }),
    [events, searchTerm, filterType, filterStatus]
  );

  // Handlers
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAdd(newForm);
    setNewForm(defaultForm);
    setCreateOpen(false);
  };
  const handleEdit = (e: Event) => {
    setEditForm({
      title: e.title,
      description: e.description,
      type: e.type,
      startDate: e.startDate,
      endDate: e.endDate,
      location: e.location,
      maxParticipants: e.maxParticipants?.toString() || "",
      registrationDeadline: e.registrationDeadline || "",
      isPublic: e.isPublic,
    });
    setEditId(e._id);
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
        "Are you sure you want to delete this event? This action cannot be undone."
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
        <h2 className="text-2xl font-bold">Events</h2>
        <button
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          onClick={() => setCreateOpen(true)}
        >
          + New Event
        </button>
      </div>
      <EventFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterType={filterType}
        setFilterType={setFilterType}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
      />
      <EventTable
        events={filtered}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <EventFormModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        form={newForm}
        setForm={setNewForm}
        handleSubmit={handleCreate}
        modalTitle="Create Event"
        submitText="Create"
      />
      <EventFormModal
        open={editOpen}
        onOpenChange={setEditOpen}
        form={editForm}
        setForm={setEditForm}
        handleSubmit={handleEditSubmit}
        modalTitle="Edit Event"
        submitText="Save"
      />
    </div>
  );
};

export default EventManager;
