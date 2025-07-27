import { useState, useMemo } from "react";
import { useApi } from "./useApi";
import type { Alumni } from "@shared/types/alumni";

export function usePublicAlumni() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGraduationYear, setFilterGraduationYear] = useState("all");
  const [filterLocation, setFilterLocation] = useState("all");

  const api = useApi<Alumni[]>("/api/alumni");

  const filteredAlumni = useMemo(() => {
    return api.data.filter((alum) => {
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
  }, [api.data, searchTerm, filterGraduationYear, filterLocation]);

  const stats = useMemo(
    () => ({
      totalAlumni: api.data.length,
      activeAlumni: api.data.filter((a) => a.isActive).length,
      locations: [...new Set(api.data.map((a) => a.currentLocation))].length,
      graduationYears: [...new Set(api.data.map((a) => a.graduationYear))]
        .length,
    }),
    [api.data]
  );

  const uniqueLocations = useMemo(
    () => [...new Set(api.data.map((a) => a.currentLocation))].sort(),
    [api.data]
  );

  const uniqueGraduationYears = useMemo(
    () =>
      [...new Set(api.data.map((a) => a.graduationYear))].sort((a, b) => b - a),
    [api.data]
  );

  return {
    ...api,
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
