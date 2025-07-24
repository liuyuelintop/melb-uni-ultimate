"use client";

import { useNotification } from "@/context/NotificationContext";
import Notification from "./Notification";

export default function NotificationToaster() {
  const { notifications, remove } = useNotification();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((n) => (
        <Notification
          key={n.id}
          type={n.type}
          message={n.message}
          onClose={() => remove(n.id)}
        />
      ))}
    </div>
  );
}