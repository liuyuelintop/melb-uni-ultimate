import React from "react";

interface AchievementCardProps {
  icon: string;
  title: string;
  description: string;
  className?: string;
}

const AchievementCard: React.FC<AchievementCardProps> = ({
  icon,
  title,
  description,
  className,
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export { AchievementCard };
