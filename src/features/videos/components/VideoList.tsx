import React from "react";
import { Video } from "@shared/types/video";
import VideoCard from "./VideoCard";
import { EmptyState } from "@shared/components/ui/EmptyState";

export interface VideoListProps {
  videos: Video[];
  onEdit?: (video: Video) => void;
  onDelete?: (video: Video) => void;
  showActions?: boolean;
  loading?: boolean;
}

const VideoList: React.FC<VideoListProps> = ({
  videos,
  onEdit,
  onDelete,
  showActions = false,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="bg-gray-200 animate-pulse rounded-lg h-80"
          />
        ))}
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <EmptyState
        title="No videos found"
        description="There are no videos available at the moment."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map((video) => (
        <VideoCard
          key={video._id}
          video={video}
          onEdit={onEdit}
          onDelete={onDelete}
          showActions={showActions}
        />
      ))}
    </div>
  );
};

export default VideoList;
