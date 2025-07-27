import { useCrud } from "./useCrud";
import { Event } from "@/types/admin";

export function useEvents() {
  return useCrud<Event>("/api/events");
}
