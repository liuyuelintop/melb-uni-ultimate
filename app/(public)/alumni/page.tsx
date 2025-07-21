"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

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

export default function PublicAlumniPage() {
  const { data: session, status } = useSession();
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGraduationYear, setFilterGraduationYear] = useState("all");
  const [filterLocation, setFilterLocation] = useState("all");

  // Fetch alumni on component mount
  useEffect(() => {
    fetchAlumni();
  }, []);

  const fetchAlumni = async () => {
    try {
      const response = await fetch("/api/alumni");
      if (response.ok) {
        const data = await response.json();
        setAlumni(data);
      } else {
        console.error("Failed to fetch alumni");
      }
    } catch (error) {
      console.error("Network error while fetching alumni");
    } finally {
      setLoading(false);
    }
  };

  const filteredAlumni = alumni.filter((alum) => {
    const matchesSearch =
      alum.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alum.studentId?.includes(searchTerm);
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Alumni Network</h1>
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

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search by name or student ID..."
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

            {alum.currentLocation && (
              <div className="mb-4">
                <span className="text-sm font-medium text-gray-700">
                  Location:
                </span>
                <p className="text-sm text-gray-900">{alum.currentLocation}</p>
              </div>
            )}

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
