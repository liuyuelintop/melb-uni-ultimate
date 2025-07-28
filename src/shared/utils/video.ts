/**
 * Builds a YouTube URL from a YouTube ID
 * @param youtubeId - The YouTube video ID
 * @param type - The type of URL to build ('watch' or 'embed')
 * @returns The complete YouTube URL
 */
export function buildYoutubeUrl(
  youtubeId: string,
  type: "watch" | "embed" = "watch"
): string {
  if (type === "embed") {
    return `https://www.youtube.com/embed/${youtubeId}`;
  }
  return `https://www.youtube.com/watch?v=${youtubeId}`;
}

/**
 * Extracts YouTube video ID from various YouTube URL formats
 * @param url - The YouTube URL
 * @returns The YouTube video ID or null if not found
 */
export function extractYoutubeId(url: string): string | null {
  if (!url) return null;

  // Remove whitespace and trim
  const cleanUrl = url.trim();

  // YouTube URL patterns
  const patterns = [
    // youtube.com/watch?v=VIDEO_ID
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    // youtube.com/v/VIDEO_ID
    /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
    // youtube.com/embed/VIDEO_ID
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = cleanUrl.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Validates if a string is a valid YouTube video ID
 * @param youtubeId - The YouTube video ID to validate
 * @returns True if valid, false otherwise
 */
export function isValidYoutubeId(youtubeId: string): boolean {
  if (!youtubeId) return false;

  // YouTube video IDs are 11 characters long and contain alphanumeric characters, hyphens, and underscores
  const youtubeIdPattern = /^[a-zA-Z0-9_-]{11}$/;
  return youtubeIdPattern.test(youtubeId);
}

/**
 * Validates if a URL is a valid YouTube URL
 * @param url - The URL to validate
 * @returns True if valid YouTube URL, false otherwise
 */
export function isValidYoutubeUrl(url: string): boolean {
  if (!url) return false;

  const youtubeId = extractYoutubeId(url);
  return youtubeId !== null && isValidYoutubeId(youtubeId);
}

/**
 * Generates a thumbnail URL from YouTube video ID
 * @param youtubeId - The YouTube video ID
 * @param quality - The thumbnail quality ('default', 'medium', 'high', 'maxres')
 * @returns The thumbnail URL
 */
export function getYoutubeThumbnailUrl(
  youtubeId: string,
  quality: "default" | "medium" | "high" | "maxres" = "medium"
): string {
  return `https://img.youtube.com/vi/${youtubeId}/${quality}default.jpg`;
}
