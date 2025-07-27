export interface Alumni {
  _id: string;
  name: string;
  email: string;
  studentId?: string;
  graduationYear: number;
  currentLocation?: string;
  currentJob?: string;
  company?: string;
  achievements: string[];
  contactPreference: "email" | "phone" | "linkedin";
  phoneNumber?: string;
  linkedinUrl?: string;
  isActive: boolean;
  joinDate: string;
  createdAt: string;
  updatedAt: string;
  affiliation?: string;
}
