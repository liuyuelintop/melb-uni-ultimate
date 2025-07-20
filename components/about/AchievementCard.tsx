import React from "react";
import { Card, CardContent } from "@/components/ui";

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
    <Card className={className}>
      <CardContent className="p-6 text-center">
        <div className="text-3xl mb-4">{icon}</div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
};

export { AchievementCard };
