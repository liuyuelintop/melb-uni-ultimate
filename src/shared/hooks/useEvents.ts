import { useCrud } from "./useCrud";
import { Event } from "@shared/types/admin";

export function useEvents() {
  return useCrud<Event>("/api/events");
}
