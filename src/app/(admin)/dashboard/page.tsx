"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import AdminPageLayout from "@features/admin/components/AdminPageLayout";
import Dashboard from "@features/admin/components/Dashboard";
import AdminAnnouncement from "@features/admin/components/AdminAnnouncement";
import { useDashboardStats } from "@shared/hooks/useDashboardStats";
import AdminEvent from "@features/admin/components/AdminEvent";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState("dashboard");
  const { data: statsData, loading } = useDashboardStats();

  if (status === "loading") {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-6">
            You must be logged in to access the admin panel.
          </p>
          <Link
            href="/login"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (session.user?.role !== "admin") {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-6">
            You must have admin privileges to access this page.
          </p>
          <Link
            href="/"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }
  const stats = {
    totalPlayers: statsData.totalPlayers,
    upcomingEvents: statsData.totalUpcomingEvents,
    publishedAnnouncements: statsData.totalPublishedAnnouncements,
    alumni: statsData.totalAlumni,
  };

  // Lazy load admin management components
  const AdminPlayers = dynamic(
    () => import("@features/admin/components/AdminPlayers"),
    { ssr: false }
  );
  const AdminAlumni = dynamic(() => import("@features/admin/components/AdminAlumni"), {
    ssr: false,
  });
  const AdminTournaments = dynamic(
    () => import("@features/admin/components/AdminTournaments"),
    { ssr: false }
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <AdminPageLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === "dashboard" && <Dashboard stats={stats} />}
      {activeTab === "announcements" && <AdminAnnouncement />}
      {activeTab === "events" && <AdminEvent />}
      {activeTab === "players" && <AdminPlayers />}
      {activeTab === "alumni" && <AdminAlumni />}
      {activeTab === "tournaments" && <AdminTournaments />}
    </AdminPageLayout>
  );
}
