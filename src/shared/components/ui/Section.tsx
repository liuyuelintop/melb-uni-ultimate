import React from "react";
import { cn } from "@shared/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  spacing?: "sm" | "md" | "lg" | "xl";
  background?: "default" | "light" | "dark";
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  (
    { className, spacing = "lg", background = "default", children, ...props },
    ref
  ) => {
    const spacingClasses = {
      sm: "py-8",
      md: "py-12",
      lg: "py-16",
      xl: "py-24",
    };

    const backgroundClasses = {
      default: "bg-white",
      light: "bg-gray-50",
      dark: "bg-gray-900 text-white",
    };

    return (
      <section
        ref={ref}
        className={cn(
          spacingClasses[spacing],
          backgroundClasses[background],
          className
        )}
        {...props}
      >
        {children}
      </section>
    );
  }
);

Section.displayName = "Section";

export { Section };
