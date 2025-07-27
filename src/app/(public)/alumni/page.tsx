"use client";

import { usePublicAlumni } from "@shared/hooks/usePublicAlumni";
import { AlumniStatsBar } from "@features/alumni/components/AlumniStatsBar";
import { AlumniFilters } from "@features/alumni/components/AlumniFilters";
import { AlumniList } from "@features/alumni/components/AlumniList";
import { AlumniEmptyState } from "@features/alumni/components/AlumniEmptyState";

export default function PublicAlumniPage() {
  const {
    loading,
    stats,
    searchTerm,
    setSearchTerm,
    filterGraduationYear,
    setFilterGraduationYear,
    filterLocation,
    setFilterLocation,
    filteredAlumni,
    uniqueGraduationYears,
    uniqueLocations,
  } = usePublicAlumni();

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
      <AlumniStatsBar stats={stats} />
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
      {filteredAlumni.length > 0 ? (
        <AlumniList alumni={filteredAlumni} />
      ) : (
        <AlumniEmptyState />
      )}
    </div>
  );
}
