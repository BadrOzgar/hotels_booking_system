/**
 * Browser-only image compression, used right when a file is picked (before it's ever added to
 * FormData). A modern phone photo can easily be 8-15MB; uploading that raw over a slow or
 * asymmetric connection is what made hotel/room photo uploads feel "stuck" for a couple of
 * minutes. Downscaling to a sane max dimension and re-encoding as JPEG typically shrinks that to
 * a few hundred KB with no visible quality loss for web display, and keeps uploads fast
 * regardless of the source photo's size. Only ever call this from client-side code.
 */
export async function compressImageFile(file: File, maxDimension = 1920, quality = 0.82): Promise<File> {
  // SVGs are already tiny/vector, and re-encoding would rasterize them — leave both alone.
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml") return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
    if (!blob || blob.size >= file.size) return file;

    return new File([blob], file.name.replace(/\.\w+$/, ".jpg"), { type: "image/jpeg" });
  } catch {
    // Any failure here (unsupported format, decode error) just falls back to the original file.
    return file;
  }
}
