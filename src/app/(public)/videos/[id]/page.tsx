"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Container } from "@shared/components/ui/Container";

import VideoPlayer from "@features/videos/components/VideoPlayer";
import { useVideos } from "@shared/hooks/useVideos";
import { Badge } from "@shared/components/ui/Badge";
import { Card } from "@shared/components/ui/Card";
import { Calendar, User, Tag, ArrowLeft } from "lucide-react";
import { Button } from "@shared/components/ui/Button";
import { useRouter } from "next/navigation";

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

  React.useEffect(() => {
    const fetchVideo = async () => {
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
    };

    if (videoId) {
      fetchVideo();
    }
  }, [videoId, getVideo]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading video...</p>
          </div>
        </div>
      </Container>
    );
  }

  if (error || !video) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error || "Video not found"}</p>
            <Button onClick={() => router.push("/videos")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Videos
            </Button>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => router.push("/videos")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Videos
        </Button>
      </div>

      <div className="space-y-6">
        {/* Video Player */}
        <div className="space-y-4">
          <VideoPlayer
            youtubeId={video.youtubeId}
            allowedRoles={video.allowedRoles}
            width="100%"
            height="500px"
            title={video.title}
            className="rounded-lg overflow-hidden"
          />
        </div>

        {/* Video Details */}
        <Card className="p-6">
          <div className="space-y-4">
            {/* Title and Meta */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {video.title}
              </h1>

              <div className="flex items-center text-sm text-gray-500 space-x-4">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {formatDate(video.createdAt)}
                </div>
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  Access: {video.allowedRoles.join(", ")}
                </div>
              </div>
            </div>

            {/* Description */}
            {video.description && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Description
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {video.description}
                </p>
              </div>
            )}

            {/* Tags */}
            {video.tags && video.tags.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {video.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </Container>
  );
}
