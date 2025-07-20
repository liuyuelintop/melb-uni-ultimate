import React from "react";

interface ValueCardProps {
  icon: string;
  title: string;
  description: string;
  className?: string;
}

const ValueCard: React.FC<ValueCardProps> = ({
  icon,
  title,
  description,
  className,
}) => {
  return (
    <div className={`flex items-start space-x-3 ${className}`}>
      <div className="text-2xl">{icon}</div>
      <div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export { ValueCard };
