import { useApi } from "./useApi";

interface DashboardStats {
  totalPlayers: number;
  totalAlumni: number;
  totalUpcomingEvents: number;
  totalPublishedAnnouncements: number;
}

export function useDashboardStats() {
  return useApi<DashboardStats>("/api/dashboard/stats", {
    initialData: {
      totalPlayers: 0,
      totalAlumni: 0,
      totalUpcomingEvents: 0,
      totalPublishedAnnouncements: 0,
    },
  });
}
