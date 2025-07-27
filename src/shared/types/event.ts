export interface Event {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  type: "practice" | "tournament" | "social" | "training" | "other";
  status: "upcoming" | "ongoing" | "completed";
  registrationDeadline?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  currentParticipants?: number;
}
