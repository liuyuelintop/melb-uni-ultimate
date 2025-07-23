import React from "react";

interface PlayerFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterPosition: string;
  setFilterPosition: (value: string) => void;
  filterExperience: string;
  setFilterExperience: (value: string) => void;
}

const PlayerFilters: React.FC<PlayerFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  filterPosition,
  setFilterPosition,
  filterExperience,
  setFilterExperience,
}) => (
  <div className="bg-white rounded-lg shadow-md p-4 mb-6">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <input
        type="text"
        placeholder="Search by name, email, or student ID..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <select
        value={filterPosition}
        onChange={(e) => setFilterPosition(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="all">All Positions</option>
        <option value="handler">Handler</option>
        <option value="cutter">Cutter</option>
        <option value="utility">Utility</option>
      </select>
      <select
        value={filterExperience}
        onChange={(e) => setFilterExperience(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="all">All Experience Levels</option>
        <option value="beginner">Beginner</option>
        <option value="intermediate">Intermediate</option>
        <option value="advanced">Advanced</option>
        <option value="expert">Expert</option>
      </select>
    </div>
  </div>
);

export default PlayerFilters;
