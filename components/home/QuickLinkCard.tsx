import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui";
import { cn } from "@/lib/utils";

interface QuickLinkCardProps {
  title: string;
  description: string;
  href: string;
  className?: string;
}

const QuickLinkCard: React.FC<QuickLinkCardProps> = ({
  title,
  description,
  href,
  className,
}) => {
  return (
    <Link href={href} className="block">
      <Card className={cn("hover:shadow-md transition-shadow", className)}>
        <CardContent className="p-4 text-center">
          <h3 className="font-semibold mb-2">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
};

export { QuickLinkCard };
