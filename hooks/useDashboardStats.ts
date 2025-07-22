import { useState, useEffect } from "react";

export function useDashboardStats() {
  const [totalPlayers, setTotalPlayers] = useState(0);
  const [totalAlumni, setTotalAlumni] = useState(0);
  const [totalUpcomingEvents, setTotalUpcomingEvents] = useState(0);
  const [totalPublishedAnnouncements, setTotalPublishedAnnouncements] =
    useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/dashboard/stats");
        if (res.ok) {
          const data = await res.json();
          setTotalPlayers(data.totalPlayers || 0);
          setTotalAlumni(data.totalAlumni || 0);
          setTotalUpcomingEvents(data.totalUpcomingEvents || 0);
          setTotalPublishedAnnouncements(data.totalPublishedAnnouncements || 0);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return {
    totalPlayers,
    totalAlumni,
    totalUpcomingEvents,
    totalPublishedAnnouncements,
    loading,
  };
}
