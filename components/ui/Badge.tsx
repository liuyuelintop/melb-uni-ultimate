import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: "green" | "yellow" | "red" | "blue" | "gray";
}

const colorClasses = {
  green: "bg-green-100 text-green-800",
  yellow: "bg-yellow-100 text-yellow-800",
  red: "bg-red-100 text-red-800",
  blue: "bg-blue-100 text-blue-800",
  gray: "bg-gray-100 text-gray-800",
};

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, color = "gray", ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "inline-block rounded-full px-3 py-1 text-xs font-semibold align-middle",
        colorClasses[color],
        className
      )}
      {...props}
    />
  )
);
Badge.displayName = "Badge";

export { Badge };
