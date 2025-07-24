export interface UserProfile {
  name: string;
  email: string;
  studentId: string;
  position: "handler" | "cutter" | "utility";
  experience: "beginner" | "intermediate" | "advanced" | "expert";
  phoneNumber?: string;
  role: string;
  isVerified: boolean;
}