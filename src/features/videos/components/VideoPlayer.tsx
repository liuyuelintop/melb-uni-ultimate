import React from "react";
import { useSession } from "next-auth/react";
import { buildYoutubeUrl } from "@shared/utils/video";

export interface VideoPlayerProps {
  youtubeId: string;
  allowedRoles: string[];
  width?: string | number;
  height?: string | number;
  className?: string;
  title?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  youtubeId,
  allowedRoles,
  width = "100%",
  height = "315px",
  className = "",
  title,
}) => {
  const { data: session } = useSession();

  // Check if user has access to this video
  const hasAccess = () => {
    if (!session?.user) {
      // Public access check
      return allowedRoles.includes("public");
    }

    // Check if user's role is in allowed roles
    // For now, we'll assume all authenticated users have "user" role
    // In a real app, you'd get the actual role from the session
    const userRole = "user"; // This should come from session
    return allowedRoles.includes(userRole) || allowedRoles.includes("public");
  };

  if (!hasAccess()) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`}
        style={{ width, height }}
      >
        <div className="text-center p-6">
          <div className="text-gray-500 text-sm">
            This video is not available for your current access level.
          </div>
        </div>
      </div>
    );
  }

  const videoUrl = buildYoutubeUrl(youtubeId, "embed");

  return (
    <div className={`relative ${className}`}>
      <iframe
        src={videoUrl}
        width={width}
        height={height}
        title={title || `YouTube video ${youtubeId}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="rounded-lg"
      />
    </div>
  );
};

export default VideoPlayer;
