"use client";

import { useParams } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { useAnnouncementDetail } from "@/hooks/useAnnouncementDetail";
import { AnnouncementDetail } from "@/components/public-announcements/AnnouncementDetail";
import { AnnouncementLoadingState } from "@/components/public-announcements/AnnouncementLoadingState";
import { AnnouncementErrorState } from "@/components/public-announcements/AnnouncementErrorState";

export default function AnnouncementDetailPage() {
  const params = useParams();
  const {
    data: announcement,
    loading,
    error,
  } = useAnnouncementDetail(params.id as string);

  if (loading) {
    return <AnnouncementLoadingState />;
  }

  if (error || !announcement) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Announcement Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              {error || "The announcement you're looking for doesn't exist."}
            </p>
            <AnnouncementErrorState message="Back to Announcements" />
          </div>
        </div>
      </div>
    );
  }

  return <AnnouncementDetail announcement={announcement} />;
}
