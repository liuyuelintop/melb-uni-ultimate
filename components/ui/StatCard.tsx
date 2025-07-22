import React from "react";

interface StatCardProps {
  label: string;
  value: React.ReactNode;
  colorClass?: string; // e.g., 'text-blue-600'
  description?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  colorClass = "text-blue-600",
  description,
}) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h3 className="text-lg font-semibold text-gray-900">{label}</h3>
    <p className={`text-3xl font-bold ${colorClass}`}>{value}</p>
    {description && <p className="text-sm text-gray-500">{description}</p>}
  </div>
);

export default StatCard;
