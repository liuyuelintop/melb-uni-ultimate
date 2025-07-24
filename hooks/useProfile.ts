import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import type { Notification, NotificationType } from "@/types/notification";
import type { UserProfile } from "@/types/user";


export function useProfile() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Fetch user profile from database
  useEffect(() => {
    const fetchProfile = async () => {
      if (status === "authenticated" && session?.user?.email) {
        try {
          const response = await fetch("/api/user/profile");
          if (response.ok) {
            const data = await response.json();
            setProfile(data.user);
          } else {
            addNotification("error", "Failed to fetch profile");
          }
        } catch (error) {
          addNotification("error", "Network error while fetching profile: " + error);
        } finally {
          setIsLoading(false);
        }
      } else if (status === "unauthenticated") {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [session, status]);

  const addNotification = (
    type: NotificationType,
    message: string
  ) => {
    const id = Date.now().toString();
    setNotifications((prev) => [...prev, { type, message, id }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  };

  const handleSave = async () => {
    if (!profile) return;

    setIsSaving(true);
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: profile.name,
          phoneNumber: profile.phoneNumber,
          position: profile.position,
          experience: profile.experience,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        addNotification("success", "Profile updated successfully!");
        setIsEditing(false);
      } else {
        addNotification("error", data.error || "Failed to update profile");
      }
    } catch (error) {
      addNotification("error", "Network error while updating profile : " + error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset profile to original data
    if (session?.user?.email) {
      fetch("/api/user/profile")
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            setProfile(data.user);
          }
        })
        .catch(() => {
          addNotification("error", "Failed to reset profile");
        });
    }
    setIsEditing(false);
  };

  return {
    session,
    status,
    profile,
    setProfile,
    isEditing,
    setIsEditing,
    isLoading,
    isSaving,
    notifications,
    handleSave,
    handleCancel,
  };
}