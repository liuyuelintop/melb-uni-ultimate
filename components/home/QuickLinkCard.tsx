import React from "react";
import Link from "next/link";

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
    <Link
      href={href}
      className={`block p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-center ${className}`}
    >
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </Link>
  );
};

export { QuickLinkCard };
