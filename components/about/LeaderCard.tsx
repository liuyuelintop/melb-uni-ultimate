import React from "react";

interface LeaderCardProps {
  initials: string;
  title: string;
  name: string;
  className?: string;
}

const LeaderCard: React.FC<LeaderCardProps> = ({
  initials,
  title,
  name,
  className,
}) => {
  return (
    <div className={`text-center ${className}`}>
      <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
        <span className="text-2xl font-bold text-gray-600">{initials}</span>
      </div>
      <h3 className="font-semibold text-gray-900">{title}</h3>
      <p className="text-gray-600">{name}</p>
    </div>
  );
};

export { LeaderCard };
