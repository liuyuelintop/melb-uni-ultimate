export interface Announcement {
  _id: string;
  title: string;
  content: string;
  author: string;
  priority: "low" | "medium" | "high";
  isPublished: boolean;
  createdAt: string;
}

export interface Event {
  _id: string;
  title: string;
  description: string;
  type: "practice" | "tournament" | "social" | "training";
  startDate: string;
  endDate: string;
  location: string;
  status?: "upcoming" | "ongoing" | "completed";
  currentParticipants: number;
  registrationDeadline?: string;
  isPublic: boolean;
}

export interface Notification {
  type: "success" | "error" | "info";
  message: string;
  id: string;
}
