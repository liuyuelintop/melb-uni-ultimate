import React from "react";

interface AlumniFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterGraduationYear: string;
  setFilterGraduationYear: (value: string) => void;
  filterLocation: string;
  setFilterLocation: (value: string) => void;
  uniqueGraduationYears: number[];
  uniqueLocations: string[];
}

const AlumniFilters: React.FC<AlumniFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  filterGraduationYear,
  setFilterGraduationYear,
  filterLocation,
  setFilterLocation,
  uniqueGraduationYears,
  uniqueLocations,
}) => (
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
);

export default AlumniFilters;
