import { useEvents } from "@/hooks/useEvents";
import { useState } from "react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import EventFormModal from "../admin-event/EventFormModal";
import EventTable from "../admin-event/EventTable";
import EventFilters from "../admin-event/EventFilters";
import { Event } from "@/types/admin";
import { useNotification } from "@/context/NotificationContext";

export default function AdminEvent() {
  const { events, loading, addEvent, deleteEvent, updateEvent } = useEvents();
  const { notify } = useNotification();
  const [createOpen, setCreateOpen] = useState(false);
  const [newForm, setNewForm] = useState({
    title: "",
    description: "",
    type: "practice" as "practice" | "tournament" | "social" | "training",
    startDate: "",
    endDate: "",
    location: "",
    registrationDeadline: "",
    isPublic: true,
  });
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    type: "practice" as "practice" | "tournament" | "social" | "training",
    startDate: "",
    endDate: "",
    location: "",
    registrationDeadline: "",
    isPublic: true,
  });
  const [editId, setEditId] = useState<string | null>(null);

  const handleAddSubmit = async (formData: typeof newForm) => {
    const result = await addEvent({
      ...formData,
      currentParticipants: 0,
    });
    if (result.success) {
      notify("success", "Event created!");
      setCreateOpen(false);
      setNewForm({
        title: "",
        description: "",
        type: "practice",
        startDate: "",
        endDate: "",
        location: "",
        registrationDeadline: "",
        isPublic: true,
      });
    } else {
      notify("error", result.error || "Unknown error");
    }
  };

  const handleEdit = (event: Event) => {
    setEditForm({
      title: event.title,
      description: event.description,
      type: event.type,
      startDate: event.startDate,
      endDate: event.endDate,
      location: event.location,
      registrationDeadline: event.registrationDeadline || "",
      isPublic: event.isPublic,
    });
    setEditId(event._id);
    setEditOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editId) return;
    const original = events.find((ev) => ev._id === editId);
    if (!original) return;
    const result = await updateEvent(editId, {
      ...editForm,
      currentParticipants: original.currentParticipants,
      registrationDeadline: editForm.registrationDeadline || undefined,
    });
    if (result.success) {
      notify("success", "Event updated!");
      setEditOpen(false);
      setEditId(null);
    } else {
      notify("error", result.error || "Unknown error");
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this event? This action cannot be undone."
      )
    )
      return;
    const result = await deleteEvent(id);
    if (result.success) {
      notify("success", "Event deleted!");
    } else {
      notify("error", result.error || "Unknown error");
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-bold">Events</h2>
        <button
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2.5 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
          onClick={() => setCreateOpen(true)}
        >
          New Event
        </button>
      </div>
      <EventFilters
        searchTerm={""}
        setSearchTerm={() => {}}
        filterType={"all"}
        setFilterType={() => {}}
        filterStatus={"all"}
        setFilterStatus={() => {}}
      />
      <EventTable events={events} onEdit={handleEdit} onDelete={handleDelete} />
      <EventFormModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        form={newForm}
        setForm={setNewForm}
        handleSubmit={(e) => {
          e.preventDefault();
          handleAddSubmit(newForm);
        }}
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
}
