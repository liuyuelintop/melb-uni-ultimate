import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";

interface HeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  actions?: {
    label: string;
    href: string;
    variant?: "primary" | "secondary" | "outline";
  }[];
  className?: string;
}

const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  description,
  actions = [],
  className,
}) => {
  return (
    <div className={cn("text-center py-12 md:py-16", className)}>
      {subtitle && (
        <p className="text-lg text-blue-600 font-semibold mb-4">{subtitle}</p>
      )}
      <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
        {title}
      </h1>
      {description && (
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          {description}
        </p>
      )}
      {actions.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {actions.map((action, index) => (
            <Button key={index} variant={action.variant || "primary"} size="lg">
              <a href={action.href}>{action.label}</a>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export { Hero };
