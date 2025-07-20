export interface AdminConfig {
  tabs: {
    id: string;
    label: string;
    icon?: string;
  }[];
  eventTypes: {
    value: string;
    label: string;
  }[];
  priorityLevels: {
    value: string;
    label: string;
  }[];
  eventStatuses: {
    value: string;
    label: string;
  }[];
  formDefaults: {
    announcement: {
      title: string;
      content: string;
      priority: "low" | "medium" | "high";
      isPublished: boolean;
    };
    event: {
      title: string;
      description: string;
      type: "practice" | "tournament" | "social" | "training";
      startDate: string;
      endDate: string;
      location: string;
      maxParticipants: string;
      registrationDeadline: string;
      isPublic: boolean;
    };
  };
}

export const adminConfig: AdminConfig = {
  tabs: [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "announcements", label: "Announcements", icon: "📢" },
    { id: "events", label: "Events", icon: "📅" },
  ],
  eventTypes: [
    { value: "practice", label: "Practice" },
    { value: "tournament", label: "Tournament" },
    { value: "social", label: "Social" },
    { value: "training", label: "Training" },
  ],
  priorityLevels: [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
  ],
  eventStatuses: [
    { value: "upcoming", label: "Upcoming" },
    { value: "ongoing", label: "Ongoing" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ],
  formDefaults: {
    announcement: {
      title: "",
      content: "",
      priority: "medium",
      isPublished: false,
    },
    event: {
      title: "",
      description: "",
      type: "practice",
      startDate: "",
      endDate: "",
      location: "",
      maxParticipants: "",
      registrationDeadline: "",
      isPublic: true,
    },
  },
};
