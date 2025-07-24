import { useState, useEffect } from "react";
import type { Alumni } from "@/types/alumni";

export function usePublicAlumni() {
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGraduationYear, setFilterGraduationYear] = useState("all");
  const [filterLocation, setFilterLocation] = useState("all");

  useEffect(() => {
    fetchAlumni();
  }, []);

  const fetchAlumni = async () => {
    try {
      const response = await fetch("/api/alumni");
      if (response.ok) {
        const data = await response.json();
        setAlumni(data);
      }
    } catch (error) {
      // handle error
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

  return {
    alumni,
    loading,
    searchTerm,
    setSearchTerm,
    filterGraduationYear,
    setFilterGraduationYear,
    filterLocation,
    setFilterLocation,
    filteredAlumni,
    stats,
    uniqueLocations,
    uniqueGraduationYears,
  };
}
