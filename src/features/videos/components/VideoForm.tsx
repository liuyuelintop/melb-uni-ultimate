import React, { useState, useEffect } from "react";
import { Input } from "@shared/components/ui/input";
import { Textarea } from "@shared/components/ui/textarea";
import { Label } from "@shared/components/ui/label";
import { Switch } from "@shared/components/ui/switch";
import { Button } from "@shared/components/ui/Button";
import {
  extractYoutubeId,
  isValidYoutubeUrl,
  getYoutubeThumbnailUrl,
} from "@shared/utils/video";
import VideoPlayer from "./VideoPlayer";
import { CreateVideoRequest } from "@shared/types/video";

export interface VideoFormProps {
  form: CreateVideoRequest;
  onChange: (
    field: keyof CreateVideoRequest,
    value: string | string[] | boolean
  ) => void;
  onSubmit: () => void;
  submitLabel?: string;
  disabled?: boolean;
  isEdit?: boolean;
}

const VideoForm: React.FC<VideoFormProps> = ({
  form,
  onChange,
  onSubmit,
  submitLabel = "Create Video",
  disabled = false,
  isEdit = false,
}) => {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [urlError, setUrlError] = useState("");
  const [extractedId, setExtractedId] = useState("");

  // Handle YouTube URL input
  const handleYoutubeUrlChange = (url: string) => {
    setYoutubeUrl(url);
    setUrlError("");

    if (url.trim()) {
      const youtubeId = extractYoutubeId(url);
      if (youtubeId) {
        setExtractedId(youtubeId);
        onChange("youtubeId", youtubeId);

        // Auto-generate thumbnail URL if not provided
        if (!form.thumbnailUrl) {
          onChange("thumbnailUrl", getYoutubeThumbnailUrl(youtubeId));
        }
      } else {
        setUrlError("Please enter a valid YouTube URL");
        setExtractedId("");
        onChange("youtubeId", "");
      }
    } else {
      setExtractedId("");
      onChange("youtubeId", "");
    }
  };

  // Handle direct YouTube ID input
  const handleYoutubeIdChange = (id: string) => {
    onChange("youtubeId", id);
    setExtractedId(id);
    setUrlError("");
  };

  // Handle tags input
  const handleTagsChange = (tagsString: string) => {
    const tags = tagsString
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
    onChange("tags", tags);
  };

  // Handle allowed roles input
  const handleAllowedRolesChange = (rolesString: string) => {
    const roles = rolesString
      .split(",")
      .map((role) => role.trim())
      .filter((role) => role.length > 0);
    onChange("allowedRoles", roles);
  };

  // Initialize form with existing data for edit mode
  useEffect(() => {
    if (isEdit && form.youtubeId) {
      setExtractedId(form.youtubeId);
      setYoutubeUrl(`https://www.youtube.com/watch?v=${form.youtubeId}`);
    }
  }, [isEdit, form.youtubeId]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="video-title">Video Title</Label>
        <Input
          id="video-title"
          type="text"
          placeholder="Enter video title"
          value={form.title}
          onChange={(e) => onChange("title", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="video-description">Description (Optional)</Label>
        <Textarea
          id="video-description"
          placeholder="Enter video description"
          value={form.description || ""}
          onChange={(e) => onChange("description", e.target.value)}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="youtube-url">YouTube URL</Label>
        <Input
          id="youtube-url"
          type="url"
          placeholder="https://www.youtube.com/watch?v=..."
          value={youtubeUrl}
          onChange={(e) => handleYoutubeUrlChange(e.target.value)}
          className={urlError ? "border-red-500" : ""}
        />
        {urlError && <p className="text-sm text-red-500">{urlError}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="youtube-id">YouTube ID (Auto-extracted)</Label>
        <Input
          id="youtube-id"
          type="text"
          placeholder="YouTube video ID"
          value={extractedId}
          onChange={(e) => handleYoutubeIdChange(e.target.value)}
          readOnly={!isEdit} // Only allow manual editing in edit mode
        />
      </div>

      {extractedId && (
        <div className="space-y-2">
          <Label>Video Preview</Label>
          <div className="border rounded-lg p-4 bg-gray-50">
            <VideoPlayer
              youtubeId={extractedId}
              allowedRoles={form.allowedRoles || ["public"]}
              width="100%"
              height="200px"
              title={form.title || "Video Preview"}
            />
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="video-tags">Tags (comma-separated)</Label>
        <Input
          id="video-tags"
          type="text"
          placeholder="training, highlights, tutorial"
          value={Array.isArray(form.tags) ? form.tags.join(", ") : ""}
          onChange={(e) => handleTagsChange(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="allowed-roles">Allowed Roles (comma-separated)</Label>
        <Input
          id="allowed-roles"
          type="text"
          placeholder="public, user, admin"
          value={
            Array.isArray(form.allowedRoles) ? form.allowedRoles.join(", ") : ""
          }
          onChange={(e) => handleAllowedRolesChange(e.target.value)}
        />
        <p className="text-sm text-gray-500">
          Roles that can access this video. Use &quot;public&quot; for everyone.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="thumbnail-url">Thumbnail URL (Optional)</Label>
        <Input
          id="thumbnail-url"
          type="url"
          placeholder="Custom thumbnail URL"
          value={form.thumbnailUrl || ""}
          onChange={(e) => onChange("thumbnailUrl", e.target.value)}
        />
        {extractedId && !form.thumbnailUrl && (
          <p className="text-sm text-gray-500">
            Auto-generated: {getYoutubeThumbnailUrl(extractedId)}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Switch
          id="video-publish"
          checked={form.isPublished !== undefined ? form.isPublished : true}
          onCheckedChange={(checked) => onChange("isPublished", checked)}
        />
        <Label htmlFor="video-publish" className="text-sm font-normal">
          Publish immediately
        </Label>
      </div>

      <Button
        onClick={onSubmit}
        disabled={disabled || !form.title || !extractedId}
        className="w-full"
      >
        {submitLabel}
      </Button>
    </div>
  );
};

export default VideoForm;
