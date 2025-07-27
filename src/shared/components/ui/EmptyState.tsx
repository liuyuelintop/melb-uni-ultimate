import React from "react";
import { cn } from "@shared/lib/utils";

interface EmptyStateProps {
  title: string;
  description?: string;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  className,
}) => {
  return (
    <div className={cn("text-center text-gray-500", className)}>
      <p>{title}</p>
      {description && <p className="text-sm mt-2">{description}</p>}
    </div>
  );
};

export { EmptyState };
