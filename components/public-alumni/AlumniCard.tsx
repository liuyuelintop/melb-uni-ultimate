import type { Alumni } from "@/types/alumni";

export function AlumniCard({ alum }: { alum: Alumni }) {
  return (
    <div
      className={`bg-white rounded-lg shadow-md p-6 ${
        !alum.isActive ? "opacity-60" : ""
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{alum.name}</h3>
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
          <span className="text-sm font-medium text-gray-700">Location:</span>
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
  );
}
