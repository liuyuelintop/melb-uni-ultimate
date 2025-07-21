import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/label";
import {
  User,
  GraduationCap,
  Briefcase,
  Trophy,
  Phone,
  Save,
  X,
} from "lucide-react";

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

interface Notification {
  type: "success" | "error" | "info";
  message: string;
  id: string;
}

export default function AlumniManager() {
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGraduationYear, setFilterGraduationYear] = useState("all");
  const [filterLocation, setFilterLocation] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [newAlumni, setNewAlumni] = useState({
    name: "",
    email: "",
    studentId: "",
    graduationYear: "",
    currentLocation: "",
    currentJob: "",
    company: "",
    achievements: [""],
    contactPreference: "email" as "email" | "phone" | "linkedin",
    phoneNumber: "",
    linkedinUrl: "",
    affiliation: "",
  });
  const [editAlumni, setEditAlumni] = useState<Alumni | null>(null);
  const [editForm, setEditForm] = useState<Partial<Alumni> | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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

  const fetchAlumni = async () => {
    try {
      const response = await fetch("/api/alumni");
      if (response.ok) {
        const data = await response.json();
        setAlumni(data);
      } else {
        addNotification("error", "Failed to fetch alumni");
      }
    } catch (error) {
      addNotification("error", "Network error while fetching alumni");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlumni();
  }, []);

  // Stats
  const stats = {
    totalAlumni: alumni.length,
    activeAlumni: alumni.filter((a) => a.isActive).length,
    locations: [...new Set(alumni.map((a) => a.currentLocation))].length,
    graduationYears: [...new Set(alumni.map((a) => a.graduationYear))].length,
  };

  const uniqueLocations = [
    ...new Set(alumni.map((a) => a.currentLocation)),
  ].sort();
  const uniqueGraduationYears = [
    ...new Set(alumni.map((a) => a.graduationYear)),
  ].sort((a, b) => b - a);

  // Filtering
  const filteredAlumni = alumni.filter((alum) => {
    const matchesSearch =
      alum.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alum.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  // Add, delete, toggle status, etc.
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
        addNotification("success", "Alumni deleted successfully");
        setAlumni(alumni.filter((a) => a._id !== id));
      } else {
        const data = await response.json();
        addNotification("error", data.error || "Failed to delete alumni");
      }
    } catch (error) {
      addNotification("error", "Network error while deleting alumni");
    }
  };

  const toggleAlumniStatus = async (id: string) => {
    try {
      const response = await fetch(`/api/alumni/${id}`, { method: "PATCH" });
      if (response.ok) {
        const data = await response.json();
        setAlumni(alumni.map((a) => (a._id === id ? data.alumni : a)));
        addNotification(
          "success",
          `Alumni ${
            data.alumni.isActive ? "activated" : "deactivated"
          } successfully`
        );
      } else {
        const data = await response.json();
        addNotification(
          "error",
          data.error || "Failed to update alumni status"
        );
      }
    } catch (error) {
      addNotification("error", "Network error while updating alumni status");
    }
  };

  const openEditModal = (alum: Alumni) => {
    setEditAlumni(alum);
    setEditForm({
      name: alum.name || "",
      email: alum.email || "",
      studentId: alum.studentId || "",
      graduationYear: alum.graduationYear ? alum.graduationYear.toString() : "",
      currentLocation: alum.currentLocation || "",
      currentJob: alum.currentJob || "",
      company: alum.company || "",
      achievements: Array.isArray(alum.achievements) ? alum.achievements : [""],
      contactPreference: alum.contactPreference || "email",
      phoneNumber: alum.phoneNumber || "",
      linkedinUrl: alum.linkedinUrl || "",
      affiliation: alum.affiliation || "",
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
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
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
            ? parseInt(editForm.graduationYear)
            : undefined,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setAlumni(
          alumni.map((a) => (a._id === editAlumni._id ? data.alumni : a))
        );
        addNotification("success", "Alumni updated successfully");
        closeEditModal();
      } else {
        addNotification("error", data.error || "Failed to update alumni");
      }
    } catch (error) {
      addNotification("error", "Network error while updating alumni");
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
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`px-4 py-3 rounded-md shadow-lg max-w-sm ${
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

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Alumni Network</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          {showAddForm ? "Cancel" : "Add Alumni"}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <h3 className="text-lg font-semibold text-gray-900">Total Alumni</h3>
          <p className="text-2xl font-bold text-blue-600">
            {stats.totalAlumni}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <h3 className="text-lg font-semibold text-gray-900">Active</h3>
          <p className="text-2xl font-bold text-green-600">
            {stats.activeAlumni}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <h3 className="text-lg font-semibold text-gray-900">Locations</h3>
          <p className="text-2xl font-bold text-purple-600">
            {stats.locations}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <h3 className="text-lg font-semibold text-gray-900">
            Graduation Years
          </h3>
          <p className="text-2xl font-bold text-orange-600">
            {stats.graduationYears}
          </p>
        </div>
      </div>

      {/* Add Alumni Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Add New Alumni</h2>
          {/* ...form fields for newAlumni... */}
          {/* ...submit button, validation, etc... */}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search by name, email, job, or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={filterGraduationYear}
            onChange={(e) => setFilterGraduationYear(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Graduation Years</option>
            {uniqueGraduationYears.map((year) => (
              <option key={year} value={year.toString()}>
                {year}
              </option>
            ))}
          </select>
          <select
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Locations</option>
            {uniqueLocations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Alumni List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAlumni.map((alum) => (
          <div
            key={alum._id}
            className={`bg-white rounded-lg shadow-md p-6 ${
              !alum.isActive ? "opacity-60" : ""
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {alum.name}
                </h3>
                <p className="text-sm text-gray-500">
                  Class of {alum.graduationYear}
                </p>
              </div>
              <span
                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  alum.isActive
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {alum.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              {alum.currentJob && (
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Job:
                  </span>
                  <p className="text-sm text-gray-900">{alum.currentJob}</p>
                </div>
              )}
              {alum.company && (
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Company:
                  </span>
                  <p className="text-sm text-gray-900">{alum.company}</p>
                </div>
              )}
              {alum.currentLocation && (
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Location:
                  </span>
                  <p className="text-sm text-gray-900">
                    {alum.currentLocation}
                  </p>
                </div>
              )}
            </div>

            {alum.achievements.length > 0 && (
              <div className="mb-4">
                <span className="text-sm font-medium text-gray-700">
                  Achievements:
                </span>
                <ul className="mt-1 space-y-1">
                  {alum.achievements.map((achievement, index) => (
                    <li key={index} className="text-sm text-gray-600">
                      • {achievement}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                <div>
                  <span className="font-medium">Contact:</span>{" "}
                  {alum.contactPreference}
                </div>
                {alum.phoneNumber && (
                  <div>
                    <span className="font-medium">Phone:</span>{" "}
                    {alum.phoneNumber}
                  </div>
                )}
                {alum.email && (
                  <div>
                    <span className="font-medium">Email:</span> {alum.email}
                  </div>
                )}
                {alum.linkedinUrl && (
                  <div>
                    <span className="font-medium">LinkedIn:</span>{" "}
                    <a
                      href={alum.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      View Profile
                    </a>
                  </div>
                )}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => openEditModal(alum)}
                  className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteAlumni(alum._id)}
                  className="text-xs px-2 py-1 rounded bg-red-100 text-red-800 hover:bg-red-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAlumni.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No alumni found matching your criteria.
        </div>
      )}

      <Dialog
        open={isEditModalOpen}
        onOpenChange={(open) => !open && closeEditModal()}
      >
        <DialogContent
          className="max-w-4xl bg-background/95 backdrop-blur-xl border border-border/50 shadow-2xl p-0"
          showCloseButton={true}
        >
          <DialogHeader className="p-6 pb-4 border-b border-border/50">
            <DialogTitle className="text-2xl font-bold tracking-tight text-foreground">
              Edit Alumni
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh] p-6 pt-4">
            {editForm && (
              <form onSubmit={handleEditSubmit} className="space-y-8">
                {/* Personal Information Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
                      <User className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Personal Information
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="edit-alumni-name">Full Name</Label>
                      <Input
                        id="edit-alumni-name"
                        name="name"
                        value={editForm.name || ""}
                        onChange={handleEditChange}
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="edit-alumni-studentId">Student ID</Label>
                      <Input
                        id="edit-alumni-studentId"
                        name="studentId"
                        value={editForm.studentId || ""}
                        onChange={handleEditChange}
                      />
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                      <Label htmlFor="edit-alumni-email">Email Address</Label>
                      <Input
                        id="edit-alumni-email"
                        type="email"
                        name="email"
                        value={editForm.email || ""}
                        onChange={handleEditChange}
                        required
                      />
                    </div>
                  </div>
                </div>
                {/* Academic Information Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
                      <GraduationCap className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Academic Information
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="edit-alumni-graduationYear">
                        Graduation Year
                      </Label>
                      <Input
                        id="edit-alumni-graduationYear"
                        type="number"
                        name="graduationYear"
                        value={editForm.graduationYear || ""}
                        onChange={handleEditChange}
                        min={2010}
                        max={2030}
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="edit-alumni-currentLocation">
                        Current Location
                      </Label>
                      <Input
                        id="edit-alumni-currentLocation"
                        name="currentLocation"
                        value={editForm.currentLocation || ""}
                        onChange={handleEditChange}
                      />
                    </div>
                  </div>
                </div>
                {/* Professional Information Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
                      <Briefcase className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Professional Information
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="edit-alumni-currentJob">
                        Current Job
                      </Label>
                      <Input
                        id="edit-alumni-currentJob"
                        name="currentJob"
                        value={editForm.currentJob || ""}
                        onChange={handleEditChange}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="edit-alumni-company">Company</Label>
                      <Input
                        id="edit-alumni-company"
                        name="company"
                        value={editForm.company || ""}
                        onChange={handleEditChange}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="edit-alumni-phoneNumber">
                        Phone Number
                      </Label>
                      <Input
                        id="edit-alumni-phoneNumber"
                        type="tel"
                        name="phoneNumber"
                        value={editForm.phoneNumber || ""}
                        onChange={handleEditChange}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="edit-alumni-linkedinUrl">
                        LinkedIn Profile
                      </Label>
                      <Input
                        id="edit-alumni-linkedinUrl"
                        type="url"
                        name="linkedinUrl"
                        value={editForm.linkedinUrl || ""}
                        onChange={handleEditChange}
                      />
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                      <Label htmlFor="edit-alumni-affiliation">
                        Affiliation
                      </Label>
                      <Input
                        id="edit-alumni-affiliation"
                        name="affiliation"
                        value={editForm.affiliation || ""}
                        onChange={handleEditChange}
                      />
                    </div>
                  </div>
                </div>
                {/* Achievements Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
                      <Trophy className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Achievements
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5 md:col-span-2">
                      <Label htmlFor="edit-alumni-achievements">
                        Achievements
                      </Label>
                      <Textarea
                        id="edit-alumni-achievements"
                        name="achievements"
                        value={
                          Array.isArray(editForm.achievements)
                            ? editForm.achievements.join("\n")
                            : editForm.achievements || ""
                        }
                        onChange={(e) =>
                          setEditForm((f) =>
                            f
                              ? {
                                  ...f,
                                  achievements: e.target.value.split("\n"),
                                }
                              : f
                          )
                        }
                        rows={4}
                        className="min-h-[120px]"
                        placeholder="Enter achievements, one per line..."
                      />
                    </div>
                  </div>
                </div>
                {/* Contact Preferences Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
                      <Phone className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Contact Preferences
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="edit-alumni-contactPreference">
                        Preferred Contact Method
                      </Label>
                      <Select
                        name="contactPreference"
                        value={editForm.contactPreference || "email"}
                        onValueChange={(value) =>
                          setEditForm((f) =>
                            f
                              ? {
                                  ...f,
                                  contactPreference: value as
                                    | "email"
                                    | "phone"
                                    | "linkedin",
                                }
                              : f
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select contact method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="phone">Phone</SelectItem>
                          <SelectItem value="linkedin">LinkedIn</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <DialogFooter className="p-6 pt-4 border-t border-border/50 flex justify-end gap-3">
                  <DialogClose asChild>
                    <Button variant="outline" type="button">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="submit">
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                </DialogFooter>
              </form>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
