export interface Video {
  _id: string;
  title: string;
  description?: string;
  youtubeId: string;
  thumbnailUrl?: string;
  tags: string[];
  createdBy: string;
  allowedRoles: string[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVideoRequest {
  title: string;
  description?: string;
  youtubeId: string;
  thumbnailUrl?: string;
  tags?: string[];
  allowedRoles?: string[];
  isPublished?: boolean;
}

export interface UpdateVideoRequest {
  title?: string;
  description?: string;
  thumbnailUrl?: string;
  tags?: string[];
  allowedRoles?: string[];
  isPublished?: boolean;
}
