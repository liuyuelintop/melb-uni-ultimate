import { useState, useEffect } from "react";
import {
  Video,
  CreateVideoRequest,
  UpdateVideoRequest,
} from "@shared/types/video";

export const useVideos = (isPublic = false) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = isPublic ? "/api/videos" : "/api/videos";

  const apiCall = async <T>(
    url: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
    body?: unknown
  ): Promise<T> => {
    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (body && method !== "GET") {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`
      );
    }

    return response.json();
  };

  const fetchVideos = async (params?: Record<string, string>) => {
    try {
      setLoading(true);
      setError(null);

      const queryString = params ? new URLSearchParams(params).toString() : "";
      const url = queryString ? `${baseUrl}?${queryString}` : baseUrl;

      const response = await apiCall<Video[]>(url, "GET");
      setVideos(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch videos");
    } finally {
      setLoading(false);
    }
  };

  const createVideo = async (videoData: CreateVideoRequest): Promise<Video> => {
    const response = await apiCall<Video>(baseUrl, "POST", videoData);
    setVideos((prev) => [response, ...prev]);
    return response;
  };

  const updateVideo = async (
    id: string,
    videoData: UpdateVideoRequest
  ): Promise<Video> => {
    const response = await apiCall<Video>(`${baseUrl}/${id}`, "PUT", videoData);
    setVideos((prev) =>
      prev.map((video) => (video._id === id ? response : video))
    );
    return response;
  };

  const deleteVideo = async (id: string): Promise<void> => {
    await apiCall(`${baseUrl}/${id}`, "DELETE");
    setVideos((prev) => prev.filter((video) => video._id !== id));
  };

  const getVideo = async (id: string): Promise<Video> => {
    return await apiCall<Video>(`${baseUrl}/${id}`, "GET");
  };

  useEffect(() => {
    fetchVideos();
  }, [isPublic]);

  return {
    videos,
    loading,
    error,
    fetchVideos,
    createVideo,
    updateVideo,
    deleteVideo,
    getVideo,
  };
};
