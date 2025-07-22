import React from "react";

interface AlumniStatsProps {
  totalAlumni: number;
  activeAlumni: number;
  locations: number;
  graduationYears: number;
}

const AlumniStats: React.FC<AlumniStatsProps> = ({
  totalAlumni,
  activeAlumni,
  locations,
  graduationYears,
}) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
    <div className="bg-white rounded-lg shadow-md p-4 text-center">
      <h3 className="text-lg font-semibold text-gray-900">Total Alumni</h3>
      <p className="text-2xl font-bold text-blue-600">{totalAlumni}</p>
    </div>
    <div className="bg-white rounded-lg shadow-md p-4 text-center">
      <h3 className="text-lg font-semibold text-gray-900">Active</h3>
      <p className="text-2xl font-bold text-green-600">{activeAlumni}</p>
    </div>
    <div className="bg-white rounded-lg shadow-md p-4 text-center">
      <h3 className="text-lg font-semibold text-gray-900">Locations</h3>
      <p className="text-2xl font-bold text-purple-600">{locations}</p>
    </div>
    <div className="bg-white rounded-lg shadow-md p-4 text-center">
      <h3 className="text-lg font-semibold text-gray-900">Graduation Years</h3>
      <p className="text-2xl font-bold text-orange-600">{graduationYears}</p>
    </div>
  </div>
);

export default AlumniStats;
