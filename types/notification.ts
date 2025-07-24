export type NotificationType = "success" | "error" | "info";

export interface Notification {
  type: "success" | "error" | "info";
  message: string;
  id: string;
}