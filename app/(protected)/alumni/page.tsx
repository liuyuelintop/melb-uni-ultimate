"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface Alumni {
  _id: string;
  name: string;
  email: string;
  studentId: string;
  graduationYear: number;
  currentLocation: string;
  currentJob: string;
  company: string;
  achievements: string[];
  contactPreference: "email" | "phone" | "linkedin";
  phoneNumber?: string;
  linkedinUrl?: string;
  isActive: boolean;
  joinDate: string;
  createdAt: string;
  updatedAt: string;
}

interface Notification {
  type: "success" | "error" | "info";
  message: string;
  id: string;
}

export default function AlumniPage() {
  const { data: session, status } = useSession();
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
  });

  // Fetch alumni on component mount
  useEffect(() => {
    if (session) {
      fetchAlumni();
    }
  }, [session]);

  // Check authentication
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
            You must be logged in to view the alumni network.
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

  const addAlumni = async () => {
    // Validation
    const requiredFields = [
      "name",
      "email",
      "studentId",
      "graduationYear",
      "currentLocation",
      "currentJob",
      "company",
    ];
    const missingFields = requiredFields.filter(
      (field) => !newAlumni[field as keyof typeof newAlumni]
    );

    if (missingFields.length > 0) {
      addNotification(
        "error",
        `Please fill in all required fields: ${missingFields.join(", ")}`
      );
      return;
    }

    if (!newAlumni.email.includes("@")) {
      addNotification("error", "Please enter a valid email address");
      return;
    }

    const gradYear = parseInt(newAlumni.graduationYear);
    if (isNaN(gradYear) || gradYear < 2010 || gradYear > 2030) {
      addNotification("error", "Graduation year must be between 2010 and 2030");
      return;
    }

    // Filter out empty achievements
    const achievements = newAlumni.achievements.filter(
      (achievement) => achievement.trim() !== ""
    );

    try {
      const response = await fetch("/api/alumni", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newAlumni.name,
          email: newAlumni.email,
          studentId: newAlumni.studentId,
          graduationYear: gradYear,
          currentLocation: newAlumni.currentLocation,
          currentJob: newAlumni.currentJob,
          company: newAlumni.company,
          achievements,
          contactPreference: newAlumni.contactPreference,
          phoneNumber: newAlumni.phoneNumber,
          linkedinUrl: newAlumni.linkedinUrl,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        addNotification("success", "Alumni added successfully!");
        setAlumni([data.alumni, ...alumni]);
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
        });
        setShowAddForm(false);
      } else {
        addNotification("error", data.error || "Failed to add alumni");
      }
    } catch (error) {
      addNotification("error", "Network error while adding alumni");
    }
  };

  const deleteAlumni = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this alumni? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/alumni/${id}`, {
        method: "DELETE",
      });

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
      const response = await fetch(`/api/alumni/${id}`, {
        method: "PATCH",
      });

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

  const addAchievementField = () => {
    setNewAlumni({
      ...newAlumni,
      achievements: [...newAlumni.achievements, ""],
    });
  };

  const removeAchievementField = (index: number) => {
    setNewAlumni({
      ...newAlumni,
      achievements: newAlumni.achievements.filter((_, i) => i !== index),
    });
  };

  const updateAchievement = (index: number, value: string) => {
    const newAchievements = [...newAlumni.achievements];
    newAchievements[index] = value;
    setNewAlumni({
      ...newAlumni,
      achievements: newAchievements,
    });
  };

  const filteredAlumni = alumni.filter((alum) => {
    const matchesSearch =
      alum.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alum.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alum.studentId.includes(searchTerm) ||
      alum.currentJob.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alum.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGraduationYear =
      filterGraduationYear === "all" ||
      alum.graduationYear.toString() === filterGraduationYear;
    const matchesLocation =
      filterLocation === "all" ||
      alum.currentLocation.toLowerCase().includes(filterLocation.toLowerCase());

    return matchesSearch && matchesGraduationYear && matchesLocation;
  });

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                placeholder="Full Name"
                value={newAlumni.name}
                onChange={(e) =>
                  setNewAlumni({ ...newAlumni, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                placeholder="alumni@example.com"
                value={newAlumni.email}
                onChange={(e) =>
                  setNewAlumni({ ...newAlumni, email: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Student ID *
              </label>
              <input
                type="text"
                placeholder="12345678"
                value={newAlumni.studentId}
                onChange={(e) =>
                  setNewAlumni({ ...newAlumni, studentId: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Graduation Year *
              </label>
              <input
                type="number"
                placeholder="2020"
                min="2010"
                max="2030"
                value={newAlumni.graduationYear}
                onChange={(e) =>
                  setNewAlumni({ ...newAlumni, graduationYear: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Location *
              </label>
              <input
                type="text"
                placeholder="Melbourne, Australia"
                value={newAlumni.currentLocation}
                onChange={(e) =>
                  setNewAlumni({
                    ...newAlumni,
                    currentLocation: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Job *
              </label>
              <input
                type="text"
                placeholder="Software Engineer"
                value={newAlumni.currentJob}
                onChange={(e) =>
                  setNewAlumni({ ...newAlumni, currentJob: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company *
              </label>
              <input
                type="text"
                placeholder="Google"
                value={newAlumni.company}
                onChange={(e) =>
                  setNewAlumni({ ...newAlumni, company: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Preference
              </label>
              <select
                value={newAlumni.contactPreference}
                onChange={(e) =>
                  setNewAlumni({
                    ...newAlumni,
                    contactPreference: e.target.value as
                      | "email"
                      | "phone"
                      | "linkedin",
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="email">Email</option>
                <option value="phone">Phone</option>
                <option value="linkedin">LinkedIn</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="+61 400 123 456"
                value={newAlumni.phoneNumber}
                onChange={(e) =>
                  setNewAlumni({ ...newAlumni, phoneNumber: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                LinkedIn URL
              </label>
              <input
                type="url"
                placeholder="https://linkedin.com/in/username"
                value={newAlumni.linkedinUrl}
                onChange={(e) =>
                  setNewAlumni({ ...newAlumni, linkedinUrl: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Achievements Section */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Achievements
            </label>
            {newAlumni.achievements.map((achievement, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Enter achievement"
                  value={achievement}
                  onChange={(e) => updateAchievement(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => removeAchievementField(index)}
                  className="px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addAchievementField}
              className="mt-2 px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200"
            >
              Add Achievement
            </button>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={addAlumni}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add Alumni
            </button>
          </div>
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
              <div>
                <span className="text-sm font-medium text-gray-700">Job:</span>
                <p className="text-sm text-gray-900">{alum.currentJob}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">
                  Company:
                </span>
                <p className="text-sm text-gray-900">{alum.company}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">
                  Location:
                </span>
                <p className="text-sm text-gray-900">{alum.currentLocation}</p>
              </div>
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
                Contact: {alum.contactPreference}
              </div>
              {session?.user?.role === "admin" && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => toggleAlumniStatus(alum._id)}
                    className={`text-xs px-2 py-1 rounded ${
                      alum.isActive
                        ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                        : "bg-green-100 text-green-800 hover:bg-green-200"
                    }`}
                  >
                    {alum.isActive ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => deleteAlumni(alum._id)}
                    className="text-xs px-2 py-1 rounded bg-red-100 text-red-800 hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredAlumni.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No alumni found matching your criteria.
        </div>
      )}
    </div>
  );
}
