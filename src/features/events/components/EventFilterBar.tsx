import React from "react";
import { clsx } from "clsx";
import { Calendar, Clock, Archive } from "lucide-react";

interface EventFilterBarProps {
  filter: "all" | "active" | "completed";
  setFilter: (filter: "all" | "active" | "completed") => void;
}

export function EventFilterBar({ filter, setFilter }: EventFilterBarProps) {
  const filterOptions = [
    {
      key: "active" as const,
      label: "Upcoming & Ongoing",
      icon: Clock,
      count: null, // You can pass actual counts as props if needed
    },
    {
      key: "completed" as const,
      label: "Completed",
      icon: Archive,
      count: null,
    },
    {
      key: "all" as const,
      label: "All Events",
      icon: Calendar,
      count: null,
    },
  ];

  return (
    <div className="flex flex-wrap gap-3 mb-6 p-1 bg-gray-50 rounded-xl border border-gray-200">
      {filterOptions.map(({ key, label, icon: Icon, count }) => (
        <button
          key={key}
          className={clsx(
            "relative flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 min-w-0",
            filter === key
              ? "bg-white text-blue-700 shadow-sm border border-blue-200 scale-[1.02]"
              : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
          )}
          onClick={() => setFilter(key)}
        >
          <Icon className="w-4 h-4 shrink-0" />
          <span className="whitespace-nowrap">{label}</span>
          {count !== null && (
            <span
              className={clsx(
                "ml-1 px-1.5 py-0.5 rounded-full text-xs font-medium",
                filter === key
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-200 text-gray-600"
              )}
            >
              {count}
            </span>
          )}

          {/* Active indicator */}
          {filter === key && (
            <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-blue-600 rounded-full" />
          )}
        </button>
      ))}
    </div>
  );
}
