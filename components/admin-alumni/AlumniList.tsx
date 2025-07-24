import React from "react";

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

interface AlumniListProps {
  alumni: Alumni[];
  onEdit: (alum: Alumni) => void;
  onDelete: (id: string) => void;
}

const AlumniList: React.FC<AlumniListProps> = ({
  alumni,
  onEdit,
  onDelete,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {alumni.map((alum) => (
      <div
        key={alum._id}
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
        <div className="space-y-2 mb-4">
          {alum.currentJob && (
            <div>
              <span className="text-sm font-medium text-gray-700">Job:</span>
              <p className="text-sm text-gray-900">{alum.currentJob}</p>
            </div>
          )}
          {alum.company && (
            <div>
              <span className="text-sm font-medium text-gray-700">
                Company:
              </span>
              <p className="text-sm text-gray-900">{alum.company}</p>
            </div>
          )}
          {alum.currentLocation && (
            <div>
              <span className="text-sm font-medium text-gray-700">
                Location:
              </span>
              <p className="text-sm text-gray-900">{alum.currentLocation}</p>
            </div>
          )}
        </div>
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
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            <div>
              <span className="font-medium">Contact:</span>{" "}
              {alum.contactPreference}
            </div>
            {alum.phoneNumber && (
              <div>
                <span className="font-medium">Phone:</span> {alum.phoneNumber}
              </div>
            )}
            {alum.email && (
              <div>
                <span className="font-medium">Email:</span> {alum.email}
              </div>
            )}
            {alum.linkedinUrl && (
              <div>
                <span className="font-medium">LinkedIn:</span>{" "}
                <a
                  href={alum.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  View Profile
                </a>
              </div>
            )}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(alum)}
              className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(alum._id)}
              className="text-xs px-2 py-1 rounded bg-red-100 text-red-800 hover:bg-red-200"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default AlumniList;
