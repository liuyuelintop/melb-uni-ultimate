import React from "react";
import { cn } from "@shared/lib/utils";

interface ErrorMessageProps {
  message: string;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, className }) => {
  return (
    <div className={cn("text-center text-red-600", className)}>{message}</div>
  );
};

export { ErrorMessage };
