"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Container } from "@shared/components/ui/Container";

import VideoPlayer from "@features/videos/components/VideoPlayer";
import { useVideos } from "@shared/hooks/useVideos";
import { Badge } from "@shared/components/ui/Badge";
import { Card } from "@shared/components/ui/Card";
import {
  Calendar,
  User,
  Tag,
  ArrowLeft,
  ExternalLink,
  Share2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@shared/components/ui/Button";
import { useRouter } from "next/navigation";
import { buildYoutubeUrl } from "@shared/utils/video";

// Loading skeleton component
const VideoDetailSkeleton = () => (
  <div className="space-y-4 sm:space-y-6">
    {/* Back button skeleton */}
    <div className="h-10 w-32 bg-gray-200 rounded-md animate-pulse" />

    {/* Video player skeleton */}
    <div className="aspect-video w-full bg-gray-200 rounded-lg animate-pulse" />

    {/* Content skeleton */}
    <Card className="p-4 sm:p-6">
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
        <div className="flex gap-4">
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
        </div>
      </div>
    </Card>
  </div>
);

// Error state component
const VideoDetailError = ({
  error,
  onRetry,
  onBack,
}: {
  error: string;
  onRetry: () => void;
  onBack: () => void;
}) => (
  <div className="flex items-center justify-center min-h-[50vh] px-4">
    <div className="text-center max-w-md">
      <div className="w-16 h-16 mx-auto mb-4 text-red-500">
        <AlertCircle className="w-full h-full" />
      </div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        Oops! Something went wrong
      </h2>
      <p className="text-gray-600 mb-6 text-sm leading-relaxed">
        {error || "We couldn't load this video. Please try again."}
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button onClick={onRetry} className="w-full sm:w-auto">
          Try Again
        </Button>
        <Button variant="outline" onClick={onBack} className="w-full sm:w-auto">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Videos
        </Button>
      </div>
    </div>
  </div>
);

export default function VideoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const videoId = params.id as string;

  const { getVideo } = useVideos(true);
  const [video, setVideo] = React.useState<
    import("@shared/types/video").Video | null
  >(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchVideo = React.useCallback(async () => {
    if (!videoId) return;

    try {
      setLoading(true);
      setError(null);
      const videoData = await getVideo(videoId);
      setVideo(videoData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch video");
    } finally {
      setLoading(false);
    }
  }, [videoId, getVideo]);

  React.useEffect(() => {
    fetchVideo();
  }, [fetchVideo]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleShare = async () => {
    if (navigator.share && video) {
      try {
        await navigator.share({
          title: video.title,
          text: video.description || `Watch ${video.title}`,
          url: window.location.href,
        });
      } catch (err) {
        // Fallback to copying URL
        navigator.clipboard?.writeText(window.location.href);
      }
    } else {
      // Fallback for browsers without Web Share API
      navigator.clipboard?.writeText(window.location.href);
    }
  };

  const handleExternalLink = () => {
    if (video) {
      window.open(
        buildYoutubeUrl(video.youtubeId),
        "_blank",
        "noopener,noreferrer"
      );
    }
  };

  const handleBack = () => router.push("/videos");

  if (loading) {
    return (
      <Container className="py-4 sm:py-6">
        <VideoDetailSkeleton />
      </Container>
    );
  }

  if (error || !video) {
    return (
      <Container className="py-4 sm:py-6">
        <VideoDetailError
          error={error || "Video not found"}
          onRetry={fetchVideo}
          onBack={handleBack}
        />
      </Container>
    );
  }

  return (
    <Container className="py-4 sm:py-6">
      <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-2 sm:px-3"
            aria-label="Back to videos"
          >
            <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Back to Videos</span>
            <span className="sm:hidden">Back</span>
          </Button>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="text-gray-600 hover:text-gray-900"
              aria-label="Share video"
            >
              <Share2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExternalLink}
              className="text-gray-600 hover:text-gray-900"
              aria-label="Open in YouTube"
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Video Player Section */}
        <div className="relative">
          <div className="aspect-video w-full bg-gray-100 rounded-lg overflow-hidden shadow-lg">
            <VideoPlayer
              youtubeId={video.youtubeId}
              allowedRoles={video.allowedRoles}
              width="100%"
              height="100%"
              title={video.title}
              className="w-full h-full"
            />
          </div>

          {/* Status Badge */}
          {!video.isPublished && (
            <div className="absolute top-3 left-3">
              <Badge
                variant="secondary"
                className="bg-amber-100 text-amber-800 border-amber-200 font-medium"
              >
                Draft
              </Badge>
            </div>
          )}
        </div>

        {/* Video Details Card */}
        <Card className="overflow-hidden">
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            {/* Title Section */}
            <div className="space-y-3">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                {video.title}
              </h1>

              {/* Metadata */}
              <div className="flex flex-col xs:flex-row xs:items-center gap-3 xs:gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 flex-shrink-0" />
                  <span>{formatDate(video.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">
                    Access: {video.allowedRoles.join(", ")}
                  </span>
                </div>
              </div>
            </div>

            {/* Description Section */}
            {video.description && (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-gray-900">
                  About this video
                </h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {video.description}
                  </p>
                </div>
              </div>
            )}

            {/* Tags Section */}
            {video.tags && video.tags.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-gray-900">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {video.tags.map((tag: string, index: number) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <Tag className="w-3 h-3 mr-1.5" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Additional Actions (Mobile-friendly) */}
        <Card className="sm:hidden">
          <div className="p-4">
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={handleExternalLink}
                className="w-full"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                YouTube
              </Button>
              <Button
                variant="outline"
                onClick={handleShare}
                className="w-full"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </Container>
  );
}
