"use client";

import React, { useState } from "react";
import { Container } from "@shared/components/ui/Container";
import { Button } from "@shared/components/ui/Button";
import VideoList from "@features/videos/components/VideoList";
import VideoFormModal from "@features/videos/components/VideoFormModal";
import { useVideos } from "@shared/hooks/useVideos";
import { Video, CreateVideoRequest } from "@shared/types/video";
import { Plus, Search, AlertCircle, Video as VideoIcon } from "lucide-react";
import { useNotification } from "@shared/context/NotificationContext";

const AdminVideos: React.FC = () => {
  const { videos, loading, error, createVideo, updateVideo, deleteVideo } =
    useVideos(false);
  const { notify } = useNotification();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
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

  // Filter videos based on search query
  const filteredVideos = videos.filter(
    (video) =>
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.tags?.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const publishedCount = videos.filter((v) => v.isPublished).length;
  const draftCount = videos.filter((v) => !v.isPublished).length;

  return (
    <Container className="py-4 sm:py-6">
      {/* Header Section */}
      <div className="space-y-4 sm:space-y-6">
        {/* Title and Stats */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <VideoIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              Video Management
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Manage your video library and training content
            </p>
          </div>

          {/* Quick Stats */}
          <div className="flex gap-4 text-sm">
            <div className="text-center">
              <div className="font-bold text-gray-900">{videos.length}</div>
              <div className="text-gray-500">Total</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-green-600">{publishedCount}</div>
              <div className="text-gray-500">Published</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-amber-600">{draftCount}</div>
              <div className="text-gray-500">Drafts</div>
            </div>
          </div>
        </div>

        {/* Search and Add Button Bar */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Add Button */}
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-sm hover:shadow-md transition-all duration-200 shrink-0"
          >
            <span className="hidden xs:inline">Add Video</span>
            <span className="xs:hidden">Add</span>
          </Button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-red-800">Error loading videos</h3>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Video List */}
      <div className="mt-6">
        <VideoList
          videos={filteredVideos}
          loading={loading}
          showActions={true}
          onEdit={handleEditVideo}
          onDelete={handleDeleteVideo}
        />
      </div>

      {/* Empty State */}
      {!loading && filteredVideos.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <VideoIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchQuery ? "No videos found" : "No videos yet"}
          </h3>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">
            {searchQuery
              ? `No videos match "${searchQuery}". Try adjusting your search.`
              : "Get started by creating your first video."}
          </p>
          {!searchQuery && (
            <Button onClick={() => setIsModalOpen(true)} size="lg">
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Video
            </Button>
          )}
        </div>
      )}

      {/* Modal */}
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
};

export default AdminVideos;
