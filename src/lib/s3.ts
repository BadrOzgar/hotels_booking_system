import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import { MEDIA_EXTENSIONS, isVideoMimeType } from "@/lib/media";

const MAX_IMAGE_BYTES = 15 * 1024 * 1024; // 15MB
const MAX_VIDEO_BYTES = 100 * 1024 * 1024; // 100MB

function getClient(): S3Client {
  return new S3Client({
    region: process.env.S3_REGION || "us-east-1",
    endpoint: process.env.S3_ENDPOINT || undefined,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID ?? "",
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? "",
    },
    // S3-compatible providers (R2, Spaces, MinIO) generally need path-style addressing.
    forcePathStyle: Boolean(process.env.S3_ENDPOINT),
  });
}

export function isS3Configured(): boolean {
  return Boolean(process.env.S3_BUCKET && process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY);
}

function publicUrlFor(key: string): string {
  const base = process.env.S3_PUBLIC_URL_BASE;
  if (base) return `${base.replace(/\/$/, "")}/${key}`;
  const endpoint = process.env.S3_ENDPOINT;
  const bucket = process.env.S3_BUCKET;
  if (endpoint) return `${endpoint.replace(/\/$/, "")}/${bucket}/${key}`;
  return `https://${bucket}.s3.${process.env.S3_REGION || "us-east-1"}.amazonaws.com/${key}`;
}

/** Uploads a hotel/room media file (any supported image or video format) to S3 under `folder/` and returns its public URL. */
export async function uploadMedia(file: File, folder: "hotels" | "rooms"): Promise<string> {
  if (!isS3Configured()) {
    throw new Error("Media storage isn't configured yet. Contact your platform admin.");
  }

  const extension = MEDIA_EXTENSIONS[file.type];
  if (!extension) {
    throw new Error(
      "Unsupported file type. Please upload a common image (JPEG, PNG, WebP, AVIF, GIF, HEIC) or video (MP4, WebM, MOV, OGG, AVI, MKV) format."
    );
  }

  const isVideo = isVideoMimeType(file.type);
  const maxBytes = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
  if (file.size > maxBytes) {
    throw new Error(`${isVideo ? "Video" : "Image"} must be smaller than ${maxBytes / (1024 * 1024)}MB.`);
  }

  const key = `${folder}/${randomUUID()}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    await getClient().send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: key,
        Body: buffer,
        ContentType: file.type,
      }),
      // Fail fast instead of tying up the request indefinitely on a stalled connection.
      { abortSignal: AbortSignal.timeout(60_000) }
    );
  } catch (err) {
    if (err instanceof Error && err.name === "TimeoutError") {
      throw new Error("Upload timed out — check your connection and try a smaller file.");
    }
    throw err;
  }

  return publicUrlFor(key);
}

/** Deletes a media file from S3 given its public URL (best-effort — failures are swallowed so a stale record can't block a mutation). */
export async function deleteMediaByUrl(url: string): Promise<void> {
  if (!isS3Configured()) return;
  try {
    const key = new URL(url).pathname.replace(/^\/+/, "").replace(`${process.env.S3_BUCKET}/`, "");
    await getClient().send(new DeleteObjectCommand({ Bucket: process.env.S3_BUCKET, Key: key }));
  } catch {
    // Non-fatal: an orphaned object in the bucket is preferable to blocking the user's action.
  }
}
