import React from "react";
import Link from "next/link";
import { Card } from "@shared/components/ui/Card";
import { Badge } from "@shared/components/ui/Badge";
import { Button } from "@shared/components/ui/Button";
import { Video } from "@shared/types/video";
import { buildYoutubeUrl, getYoutubeThumbnailUrl } from "@shared/utils/video";
import { Play, Calendar, User, Tag, ExternalLink } from "lucide-react";

export interface VideoCardProps {
  video: Video;
  onEdit?: (video: Video) => void;
  onDelete?: (video: Video) => void;
  onVideoClick?: (video: Video) => void;
  showActions?: boolean;
}

const VideoCard: React.FC<VideoCardProps> = ({
  video,
  onEdit,
  onDelete,
  onVideoClick,
  showActions = false,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const thumbnailUrl =
    video.thumbnailUrl || getYoutubeThumbnailUrl(video.youtubeId);

  return (
    <Card
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onVideoClick?.(video)}
    >
      <div className="relative">
        <img
          src={thumbnailUrl}
          alt={video.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center gap-2">
          <Link href={`/videos/${video._id}`}>
            <Button
              variant="ghost"
              size="sm"
              className="bg-white bg-opacity-90 hover:bg-opacity-100"
              onClick={(e) => e.stopPropagation()}
            >
              <Play className="w-4 h-4 mr-2" />
              Watch
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="bg-white bg-opacity-90 hover:bg-opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              window.open(buildYoutubeUrl(video.youtubeId), "_blank");
            }}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            YouTube
          </Button>
        </div>
        {!video.isPublished && (
          <div className="absolute top-2 right-2">
            <Badge variant="secondary">Draft</Badge>
          </div>
        )}
      </div>

      <div className="p-4">
        <Link
          href={`/videos/${video._id}`}
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-blue-600 transition-colors cursor-pointer">
            {video.title}
          </h3>
        </Link>

        {video.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {video.description}
          </p>
        )}

        <div className="flex items-center text-sm text-gray-500 mb-3">
          <Calendar className="w-4 h-4 mr-1" />
          {formatDate(video.createdAt)}
        </div>

        {video.tags && video.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {video.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </Badge>
            ))}
            {video.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{video.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <User className="w-4 h-4 mr-1" />
            Access: {video.allowedRoles.join(", ")}
          </div>

          {showActions && (
            <div className="flex gap-2">
              {onEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(video);
                  }}
                >
                  Edit
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(video);
                  }}
                  className="text-red-600 hover:text-red-700"
                >
                  Delete
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default VideoCard;
