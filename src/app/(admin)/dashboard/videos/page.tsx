"use client";

import React, { useState } from "react";
import { Container } from "@shared/components/ui/Container";
import { PageHeader } from "@shared/components/layout/PageHeader";
import { Button } from "@shared/components/ui/Button";
import VideoList from "@features/videos/components/VideoList";
import VideoFormModal from "@features/videos/components/VideoFormModal";
import { useVideos } from "@shared/hooks/useVideos";
import {
  Video,
  CreateVideoRequest,
  UpdateVideoRequest,
} from "@shared/types/video";
import { Plus, Trash2, Edit } from "lucide-react";
import { useNotification } from "@shared/context/NotificationContext";

export default function AdminVideosPage() {
  const { videos, loading, error, createVideo, updateVideo, deleteVideo } =
    useVideos(false);
  const { notify } = useNotification();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [formData, setFormData] = useState<CreateVideoRequest>({
    title: "",
    description: "",
    youtubeId: "",
    tags: [],
    allowedRoles: ["public"],
    isPublished: true,
  });

  const handleCreateVideo = async () => {
    try {
      await createVideo(formData);
      notify("success", "Video created successfully");
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      notify("error", "Failed to create video");
    }
  };

  const handleUpdateVideo = async () => {
    if (!editingVideo) return;

    try {
      await updateVideo(editingVideo._id, formData);
      notify("success", "Video updated successfully");
      setIsModalOpen(false);
      setEditingVideo(null);
      resetForm();
    } catch (error) {
      notify("error", "Failed to update video");
    }
  };

  const handleDeleteVideo = async (video: Video) => {
    if (confirm("Are you sure you want to delete this video?")) {
      try {
        await deleteVideo(video._id);
        notify("success", "Video deleted successfully");
      } catch (error) {
        notify("error", "Failed to delete video");
      }
    }
  };

  const handleEditVideo = (video: Video) => {
    setEditingVideo(video);
    setFormData({
      title: video.title,
      description: video.description || "",
      youtubeId: video.youtubeId,
      thumbnailUrl: video.thumbnailUrl || "",
      tags: video.tags || [],
      allowedRoles: video.allowedRoles || ["public"],
      isPublished: video.isPublished,
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      youtubeId: "",
      tags: [],
      allowedRoles: ["public"],
      isPublished: true,
    });
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingVideo(null);
    resetForm();
  };

  const handleFormChange = (
    field: keyof CreateVideoRequest,
    value: string | string[] | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Container>
      <PageHeader
        title="Video Management"
        description="Manage videos and training content"
      >
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Video
        </Button>
      </PageHeader>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <VideoList
        videos={videos}
        loading={loading}
        showActions={true}
        onEdit={handleEditVideo}
        onDelete={handleDeleteVideo}
      />

      <VideoFormModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        form={formData}
        onChange={handleFormChange}
        onSubmit={editingVideo ? handleUpdateVideo : handleCreateVideo}
        submitLabel={editingVideo ? "Update Video" : "Create Video"}
        isEdit={!!editingVideo}
        title={editingVideo ? "Edit Video" : "Add New Video"}
      />
    </Container>
  );
}
