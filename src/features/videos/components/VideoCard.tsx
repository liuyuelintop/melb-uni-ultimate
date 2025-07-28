import React from "react";
import Link from "next/link";
import { Card } from "@shared/components/ui/Card";
import { Badge } from "@shared/components/ui/Badge";
import { Button } from "@shared/components/ui/Button";
import { Video } from "@shared/types/video";
import { buildYoutubeUrl } from "@shared/utils/video";
import {
  Play,
  Calendar,
  User,
  Tag,
  ExternalLink,
  Edit2,
  Trash2,
} from "lucide-react";
import VideoPlayer from "./VideoPlayer";

export interface VideoCardProps {
  video: Video;
  onEdit?: (video: Video) => void;
  onDelete?: (video: Video) => void;
  showActions?: boolean;
}

const VideoCard: React.FC<VideoCardProps> = ({
  video,
  onEdit,
  onDelete,
  showActions = false,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit?.(video);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete?.(video);
  };

  const handleExternalLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(
      buildYoutubeUrl(video.youtubeId),
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <Card className="group overflow-hidden bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 w-full max-w-full">
      {/* Video Player Section */}
      <div className="relative aspect-video w-full bg-gray-100">
        <VideoPlayer
          youtubeId={video.youtubeId}
          allowedRoles={video.allowedRoles}
          width="100%"
          height="100%"
          title={video.title}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Status Badge - Top Left */}
        {!video.isPublished && (
          <div className="absolute top-3 left-3 z-10">
            <Badge
              variant="secondary"
              className="bg-amber-100 text-amber-800 border-amber-200 text-xs font-medium px-2 py-1"
            >
              Draft
            </Badge>
          </div>
        )}

        {/* Action Buttons - Top Right */}
        <div className="absolute top-3 right-3 z-10 flex gap-2">
          <Link href={`/videos/${video._id}`} className="block">
            <Button
              size="sm"
              className="bg-white/90 hover:bg-white text-gray-900 border border-gray-200 shadow-sm backdrop-blur-sm min-h-[36px] px-3"
              onClick={(e) => e.stopPropagation()}
              aria-label={`Watch ${video.title}`}
            >
              <Play className="w-4 h-4 mr-1.5 fill-current" />
              <span className="hidden xs:inline font-medium">Watch</span>
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            className="bg-white/90 hover:bg-white text-gray-700 border border-gray-200 shadow-sm backdrop-blur-sm min-h-[36px] min-w-[36px] px-2"
            onClick={handleExternalLink}
            aria-label="Open in YouTube"
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-200" />
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <div>
          <Link
            href={`/videos/${video._id}`}
            className="block group/title"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-semibold text-gray-900 text-base leading-tight line-clamp-2 group-hover/title:text-blue-600 transition-colors duration-200">
              {video.title}
            </h3>
          </Link>
        </div>

        {/* Description */}
        {video.description && (
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
            {video.description}
          </p>
        )}

        {/* Metadata Row */}
        <div className="flex items-center justify-between text-sm text-gray-500 gap-3">
          <div className="flex items-center gap-1 min-w-0 flex-1">
            <Calendar className="w-4 h-4 flex-shrink-0" />
            <span>{formatDate(video.createdAt)}</span>
          </div>

          <div className="flex items-center gap-1 min-w-0 flex-shrink-0">
            <User className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">
              {video.allowedRoles.length > 2
                ? `${video.allowedRoles.slice(0, 2).join(", ")}...`
                : video.allowedRoles.join(", ")}
            </span>
          </div>
        </div>

        {/* Tags */}
        {video.tags && video.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {video.tags.slice(0, 3).map((tag, index) => (
              <Badge
                key={index}
                variant="outline"
                className="text-xs bg-gray-50 border-gray-200 text-gray-700 px-2 py-1 flex items-center gap-1"
              >
                <Tag className="w-3 h-3" />
                <span className="truncate max-w-[80px] sm:max-w-[120px]">
                  {tag}
                </span>
              </Badge>
            ))}
            {video.tags.length > 3 && (
              <Badge
                variant="outline"
                className="text-xs bg-gray-50 border-gray-200 text-gray-500 px-2 py-1"
              >
                +{video.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Action Buttons */}
        {showActions && (onEdit || onDelete) && (
          <div className="flex gap-2 pt-2 border-t border-gray-100">
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleEdit}
                className="flex-1 sm:flex-none text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300 min-h-[36px]"
                aria-label={`Edit ${video.title}`}
              >
                <Edit2 className="w-4 h-4 mr-1.5" />
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                className="flex-1 sm:flex-none text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 hover:text-red-700 min-h-[36px]"
                aria-label={`Delete ${video.title}`}
              >
                <Trash2 className="w-4 h-4 mr-1.5" />
                Delete
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default VideoCard;
