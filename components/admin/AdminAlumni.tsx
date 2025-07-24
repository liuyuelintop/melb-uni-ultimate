import { useState, useEffect } from "react";
import AlumniStats from "@/components/alumni-manager/AlumniStats";
import AlumniFilters from "@/components/alumni-manager/AlumniFilters";
import AlumniList from "@/components/alumni-manager/AlumniList";
import AlumniEditModal from "@/components/alumni-manager/AlumniEditModal";
import AlumniCreateModal from "@/components/alumni-manager/AlumniCreateModal";
import AlumniFormModal, {
  AlumniForm,
} from "@/components/alumni-manager/AlumniFormModal";
import { useNotification } from "@/context/NotificationContext";

interface Alumni {
  _id: string;
  name: string;
  email: string;
  studentId?: string;
  graduationYear: number;
  currentLocation?: string;
  currentJob?: string;
  company?: string;
  achievements: string[];
  contactPreference: "email" | "phone" | "linkedin";
  phoneNumber?: string;
  linkedinUrl?: string;
  isActive: boolean;
  joinDate: string;
  createdAt: string;
  updatedAt: string;
  affiliation?: string;
}

export default function AdminAlumni() {
  const { notify } = useNotification();
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGraduationYear, setFilterGraduationYear] = useState("all");
  const [filterLocation, setFilterLocation] = useState("all");
  const [editAlumni, setEditAlumni] = useState<Alumni | null>(null);
  const [editForm, setEditForm] = useState<AlumniForm | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newAlumni, setNewAlumni] = useState<AlumniForm>({
    name: "",
    email: "",
    studentId: "",
    graduationYear: "",
    currentLocation: "",
    currentJob: "",
    company: "",
    achievements: [""],
    contactPreference: "email",
    phoneNumber: "",
    linkedinUrl: "",
    affiliation: "",
    isActive: true,
  });

  const fetchAlumni = async () => {
    try {
      const response = await fetch("/api/alumni");
      if (response.ok) {
        const data = await response.json();
        setAlumni(data);
      } else {
        notify("error", "Failed to fetch alumni");
      }
    } catch (error) {
      notify("error", "Network error while fetching alumni");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlumni();
  }, []);

  const stats = {
    totalAlumni: alumni.length,
    activeAlumni: alumni.filter((a) => a.isActive).length,
    locations: [...new Set(alumni.map((a) => a.currentLocation))].length,
    graduationYears: [...new Set(alumni.map((a) => a.graduationYear))].length,
  };

  const uniqueLocations = [...new Set(alumni.map((a) => a.currentLocation))]
    .filter((v): v is string => typeof v === "string")
    .sort();
  const uniqueGraduationYears = [
    ...new Set(alumni.map((a) => a.graduationYear)),
  ].sort((a, b) => b - a);

  const filteredAlumni = alumni.filter((alum) => {
    const matchesSearch =
      alum.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alum.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alum.studentId?.includes(searchTerm) ||
      alum.currentJob?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alum.company?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGraduationYear =
      filterGraduationYear === "all" ||
      alum.graduationYear.toString() === filterGraduationYear;
    const matchesLocation =
      filterLocation === "all" ||
      alum.currentLocation
        ?.toLowerCase()
        .includes(filterLocation.toLowerCase());
    return matchesSearch && matchesGraduationYear && matchesLocation;
  });

  const deleteAlumni = async (id: string) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this alumni? This action cannot be undone."
      )
    )
      return;
    try {
      const response = await fetch(`/api/alumni/${id}`, { method: "DELETE" });
      if (response.ok) {
        notify("success", "Alumni deleted successfully");
        setAlumni(alumni.filter((a) => a._id !== id));
      } else {
        const data = await response.json();
        notify("error", data.error || "Failed to delete alumni");
      }
    } catch (error) {
      notify("error", "Network error while deleting alumni");
    }
  };

  const openEditModal = (alum: Alumni) => {
    setEditAlumni(alum);
    setEditForm({
      name: alum.name || "",
      email: alum.email || "",
      studentId: alum.studentId || "",
      graduationYear: alum.graduationYear ? String(alum.graduationYear) : "",
      currentLocation: alum.currentLocation || "",
      currentJob: alum.currentJob || "",
      company: alum.company || "",
      achievements: Array.isArray(alum.achievements)
        ? alum.achievements.filter(Boolean)
        : [""],
      contactPreference: alum.contactPreference || "email",
      phoneNumber: alum.phoneNumber || "",
      linkedinUrl: alum.linkedinUrl || "",
      affiliation: alum.affiliation || "",
      isActive: typeof alum.isActive === "boolean" ? alum.isActive : true,
    });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditAlumni(null);
    setEditForm(null);
  };

  const handleEditChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    if (!editForm) return;
    setEditForm({
      ...editForm,
      [e.target.name]:
        e.target.name === "achievements"
          ? (e.target.value.split("\n").map((v) => v || "") as string[])
          : e.target.value,
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editAlumni || !editForm) return;
    try {
      const response = await fetch(`/api/alumni/${editAlumni._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editForm,
          graduationYear: editForm.graduationYear
            ? parseInt(editForm.graduationYear.toString())
            : undefined,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setAlumni(
          alumni.map((a) => (a._id === editAlumni._id ? data.alumni : a))
        );
        notify("success", "Alumni updated successfully");
        closeEditModal();
      } else {
        notify("error", data.error || "Failed to update alumni");
      }
    } catch (error) {
      notify("error", "Network error while updating alumni");
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/alumni", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newAlumni,
          graduationYear: newAlumni.graduationYear
            ? parseInt(newAlumni.graduationYear.toString())
            : undefined,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setAlumni((prev) => [data, ...prev]);
        notify("success", "Alumni added successfully");
        setIsAddModalOpen(false);
        setNewAlumni({
          name: "",
          email: "",
          studentId: "",
          graduationYear: "",
          currentLocation: "",
          currentJob: "",
          company: "",
          achievements: [""],
          contactPreference: "email",
          phoneNumber: "",
          linkedinUrl: "",
          affiliation: "",
          isActive: true,
        });
      } else {
        notify("error", data.error || "Failed to add alumni");
      }
    } catch (error) {
      notify("error", "Network error while adding alumni");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading alumni...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Alumni Network</h1>
        <p className="text-gray-600 mt-2">
          Manage alumni, view stats, and grow your network.
        </p>
      </header>

      <section className="mb-8">
        <AlumniStats {...stats} />
      </section>

      <section className="mb-6">
        <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold">Alumni Management</h2>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2.5 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
          >
            Create Alumni
          </button>
        </div>
      </section>

      <AlumniCreateModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        newAlumni={newAlumni}
        setNewAlumni={setNewAlumni}
        handleAddSubmit={handleAddSubmit}
      />

      <AlumniFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterGraduationYear={filterGraduationYear}
        setFilterGraduationYear={setFilterGraduationYear}
        filterLocation={filterLocation}
        setFilterLocation={setFilterLocation}
        uniqueGraduationYears={uniqueGraduationYears}
        uniqueLocations={uniqueLocations}
      />
      <AlumniList
        alumni={filteredAlumni}
        onEdit={openEditModal}
        onDelete={deleteAlumni}
      />
      {filteredAlumni.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No alumni found matching your criteria.
        </div>
      )}
      <AlumniEditModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        editForm={editForm as AlumniForm}
        setEditForm={
          setEditForm as React.Dispatch<React.SetStateAction<AlumniForm>>
        }
        handleEditSubmit={handleEditSubmit}
      />
    </div>
  );
}
