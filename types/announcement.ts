export interface Announcement {
  _id: string;
  title: string;
  content: string;
  author: string;
  priority: "low" | "medium" | "high";
  isPublished: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}
