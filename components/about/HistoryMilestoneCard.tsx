import React from "react";

interface HistoryMilestoneCardProps {
  year: string;
  title: string;
  description: string;
  className?: string;
}

const HistoryMilestoneCard: React.FC<HistoryMilestoneCardProps> = ({
  year,
  title,
  description,
  className,
}) => {
  return (
    <div className={`text-center ${className}`}>
      <div className="text-4xl font-bold text-blue-600 mb-2">{year}</div>
      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export { HistoryMilestoneCard };
