import React from "react";
import StatCard from "../ui/StatCard";

interface DashboardProps {
  stats: {
    totalPlayers: number;
    upcomingEvents: number;
    publishedAnnouncements: number;
    alumni: number;
  };
  recentActivity?: Array<{
    type: "player" | "event" | "announcement";
    message: string;
    time: string;
    color: string;
  }>;
}

const defaultActivity = [
  {
    type: "player",
    message: "New player registered",
    time: "2 hours ago",
    color: "bg-green-500",
  },
  {
    type: "event",
    message: "Event created",
    time: "1 day ago",
    color: "bg-blue-500",
  },
  {
    type: "announcement",
    message: "Announcement published",
    time: "2 days ago",
    color: "bg-yellow-500",
  },
];

const Dashboard: React.FC<DashboardProps> = ({ stats, recentActivity }) => (
  <>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        label="Total Players"
        value={stats.totalPlayers}
        colorClass="text-blue-600"
        description="Active members"
      />
      <StatCard
        label="Upcoming Events"
        value={stats.upcomingEvents}
        colorClass="text-green-600"
        description="This month"
      />
      <StatCard
        label="Announcements"
        value={stats.publishedAnnouncements}
        colorClass="text-yellow-600"
        description="Published"
      />
      <StatCard
        label="Alumni"
        value={stats.alumni}
        colorClass="text-purple-600"
        description="Network size"
      />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {(recentActivity || defaultActivity).map((activity, idx) => (
            <div className="flex items-center space-x-3" key={idx}>
              <div className={`w-2 h-2 rounded-full ${activity.color}`}></div>
              <div>
                <p className="text-sm font-medium">{activity.message}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </>
);

export default Dashboard;
