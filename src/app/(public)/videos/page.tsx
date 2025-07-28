"use client";

import React from "react";
import { Container } from "@shared/components/ui/Container";
import { PageHeader } from "@shared/components/layout/PageHeader";
import VideoList from "@features/videos/components/VideoList";
import { useVideos } from "@shared/hooks/useVideos";

export default function VideosPage() {
  const { videos, loading, error } = useVideos(true);

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

      <VideoList videos={videos} loading={loading} showActions={false} />
    </Container>
  );
}
