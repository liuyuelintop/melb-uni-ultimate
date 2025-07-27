interface AlumniFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterGraduationYear: string;
  setFilterGraduationYear: (year: string) => void;
  filterLocation: string;
  setFilterLocation: (loc: string) => void;
  uniqueGraduationYears: number[];
  uniqueLocations: (string | undefined)[];
}

export function AlumniFilters({
  searchTerm,
  setSearchTerm,
  filterGraduationYear,
  setFilterGraduationYear,
  filterLocation,
  setFilterLocation,
  uniqueGraduationYears,
  uniqueLocations,
}: AlumniFiltersProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Search by name"
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
          {uniqueLocations.map((location) =>
            location ? (
              <option key={location} value={location}>
                {location}
              </option>
            ) : null
          )}
        </select>
      </div>
    </div>
  );
}
