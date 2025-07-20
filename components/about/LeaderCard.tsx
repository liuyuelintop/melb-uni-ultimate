import React from "react";
import { Card, CardContent } from "@/components/ui";

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
    <Card className={className}>
      <CardContent className="p-6 text-center">
        <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
          <span className="text-2xl font-bold text-gray-600">{initials}</span>
        </div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="text-gray-600">{name}</p>
      </CardContent>
    </Card>
  );
};

export { LeaderCard };
