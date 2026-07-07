"use client";

import { useEffect, useMemo } from "react";

/** Generates (and cleans up) blob preview URLs for files the user just picked, before they're uploaded. */
export function usePreviewUrls(files: File[]): string[] {
  const urls = useMemo(() => files.map((f) => URL.createObjectURL(f)), [files]);

  useEffect(() => {
    return () => {
      urls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [urls]);

  return urls;
}
