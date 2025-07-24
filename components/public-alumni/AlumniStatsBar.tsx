interface AlumniStatsBarProps {
  stats: {
    totalAlumni: number;
    activeAlumni: number;
    locations: number;
    graduationYears: number;
  };
}

export function AlumniStatsBar({ stats }: AlumniStatsBarProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-white rounded-lg shadow-md p-4 text-center">
        <h3 className="text-lg font-semibold text-gray-900">Total Alumni</h3>
        <p className="text-2xl font-bold text-blue-600">{stats.totalAlumni}</p>
      </div>
      <div className="bg-white rounded-lg shadow-md p-4 text-center">
        <h3 className="text-lg font-semibold text-gray-900">Active</h3>
        <p className="text-2xl font-bold text-green-600">
          {stats.activeAlumni}
        </p>
      </div>
      <div className="bg-white rounded-lg shadow-md p-4 text-center">
        <h3 className="text-lg font-semibold text-gray-900">Locations</h3>
        <p className="text-2xl font-bold text-purple-600">{stats.locations}</p>
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
  );
}
