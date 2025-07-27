import React from "react";

export type NotificationType = "success" | "error" | "info";

export interface NotificationProps {
  type: NotificationType;
  message: string;
  onClose?: () => void;
}

const typeStyles: Record<NotificationType, string> = {
  success: "bg-green-500 text-white",
  error: "bg-red-500 text-white",
  info: "bg-blue-500 text-white",
};

const Notification: React.FC<NotificationProps> = ({
  type,
  message,
  onClose,
}) => (
  <div
    className={`px-4 py-3 rounded-md shadow-lg ${typeStyles[type]} flex items-center justify-between`}
  >
    <span>{message}</span>
    {onClose && (
      <button
        onClick={onClose}
        className="ml-4 text-white hover:text-gray-200 focus:outline-none"
      >
        &times;
      </button>
    )}
  </div>
);

export default Notification;
