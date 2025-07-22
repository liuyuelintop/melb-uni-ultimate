import React from "react";

interface Notification {
  type: "success" | "error" | "info";
  message: string;
  id: string;
}

interface AlumniNotificationsProps {
  notifications: Notification[];
}

const AlumniNotifications: React.FC<AlumniNotificationsProps> = ({
  notifications,
}) => (
  <div className="fixed top-4 right-4 z-50 space-y-2">
    {notifications.map((notification) => (
      <div
        key={notification.id}
        className={`px-4 py-3 rounded-md shadow-lg max-w-sm ${
          notification.type === "success"
            ? "bg-green-500 text-white"
            : notification.type === "error"
            ? "bg-red-500 text-white"
            : "bg-blue-500 text-white"
        }`}
      >
        {notification.message}
      </div>
    ))}
  </div>
);

export default AlumniNotifications;
