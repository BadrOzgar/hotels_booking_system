/** Client-safe media format constants — no Node-only imports, usable in both server and client components. */

export const IMAGE_MIME_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
  "image/heic": "heic",
  "image/heif": "heif",
  "image/svg+xml": "svg",
};

export const VIDEO_MIME_TYPES: Record<string, string> = {
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
  "video/ogg": "ogv",
  "video/x-msvideo": "avi",
  "video/x-matroska": "mkv",
};

export const MEDIA_EXTENSIONS: Record<string, string> = { ...IMAGE_MIME_TYPES, ...VIDEO_MIME_TYPES };

export function isVideoMimeType(mimeType: string): boolean {
  return mimeType in VIDEO_MIME_TYPES;
}

/** Given a stored media URL, guesses whether it's a video from its file extension (used to pick <img> vs <video> at render time). */
export function isVideoUrl(url: string): boolean {
  const ext = url.split(".").pop()?.toLowerCase();
  return Object.values(VIDEO_MIME_TYPES).includes(ext ?? "");
}

/** Accept-attribute string covering every supported image + video format, for use on file inputs. */
export const MEDIA_ACCEPT = [...Object.keys(IMAGE_MIME_TYPES), ...Object.keys(VIDEO_MIME_TYPES)].join(",");

/**
 * CSS background style for a small thumbnail/card slot: shows the cover image if one exists,
 * falls back to the gradient placeholder for videos (can't render as a CSS background) or when no media has been uploaded yet.
 */
export function coverStyle(url: string | null | undefined, gradient: string): { background?: string; backgroundImage?: string } {
  if (url && !isVideoUrl(url)) return { backgroundImage: `url(${url})` };
  return { background: gradient };
}
