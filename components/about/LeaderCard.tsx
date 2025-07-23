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
      {/* Mobile-first responsive avatar */}
      <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full mx-auto mb-2 sm:mb-3 flex items-center justify-center shadow-sm">
        <span className="text-sm sm:text-lg lg:text-xl font-bold text-blue-700">
          {initials}
        </span>
      </div>

      {/* Responsive text sizing */}
      <h3 className="font-semibold text-gray-900 text-xs sm:text-sm lg:text-base mb-1">
        {title}
      </h3>
      <p className="text-gray-600 text-xs sm:text-sm">{name}</p>
    </div>
  );
};

export { LeaderCard };
