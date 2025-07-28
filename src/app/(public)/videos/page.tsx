"use client";

import React, { useState } from "react";
import { Container } from "@shared/components/ui/Container";
import { PageHeader } from "@shared/components/layout/PageHeader";
import VideoList from "@features/videos/components/VideoList";
import { useVideos } from "@shared/hooks/useVideos";
import { Video } from "@shared/types/video";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@shared/components/ui/dialog";
import VideoPlayer from "@features/videos/components/VideoPlayer";
import { Badge } from "@shared/components/ui/Badge";
import { Calendar, User, Tag, X } from "lucide-react";
import { Button } from "@shared/components/ui/Button";

export default function VideosPage() {
  const { videos, loading, error } = useVideos(true);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
    setIsPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setSelectedVideo(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Container>
      <PageHeader
        title="Videos"
        description="Watch our latest videos and training content"
      />

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <VideoList
        videos={videos}
        loading={loading}
        showActions={false}
        onVideoClick={handleVideoClick}
      />

      {/* Video Preview Modal */}
      <Dialog open={isPreviewOpen} onOpenChange={handleClosePreview}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{selectedVideo?.title}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClosePreview}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>

          {selectedVideo && (
            <div className="space-y-6">
              {/* Video Player */}
              <div className="space-y-4">
                <VideoPlayer
                  youtubeId={selectedVideo.youtubeId}
                  allowedRoles={selectedVideo.allowedRoles}
                  width="100%"
                  height="400px"
                  title={selectedVideo.title}
                  className="rounded-lg overflow-hidden"
                />
              </div>

              {/* Video Details */}
              <div className="space-y-4">
                {/* Meta Information */}
                <div className="flex items-center text-sm text-gray-500 space-x-4">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(selectedVideo.createdAt)}
                  </div>
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    Access: {selectedVideo.allowedRoles.join(", ")}
                  </div>
                </div>

                {/* Description */}
                {selectedVideo.description && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Description
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {selectedVideo.description}
                    </p>
                  </div>
                )}

                {/* Tags */}
                {selectedVideo.tags && selectedVideo.tags.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedVideo.tags.map((tag: string, index: number) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-sm"
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
}
