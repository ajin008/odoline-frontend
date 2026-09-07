"use client";

import React, { useState, useEffect } from "react";
import { apiClient } from "@/src/lib/api-client";
import { Loader2, ImageOff, FileWarning } from "lucide-react";

/**
 * Rewrites a direct-S3 (or other legacy) URL to the equivalent same-origin
 * backend streaming endpoint when we recognize the resource path, so callers
 * that still hold an S3 url (rather than the resource id) don't hit CORS.
 * Prefer passing a backend endpoint (e.g. endpoints.cars.photoFile(...)) as
 * `src` directly wherever the id is available — this rewrite is a safety net.
 */
function toBackendStreamUrl(rawUrl: string): string {
  const photoMatch = rawUrl.match(/cars\/([a-f0-9\-]+)\/photos\/([a-f0-9\-]+)/i);
  const docMatch = rawUrl.match(/cars\/([a-f0-9\-]+)\/documents\/([a-f0-9\-]+)/i);
  const bookingDocMatch = rawUrl.match(
    /(?:bookings|booking-documents)\/([a-f0-9\-]+)\/(?:documents\/)?([a-f0-9\-]+)/i
  );
  const refurbMatch = rawUrl.match(/refurbishment\/items\/([a-f0-9\-]+)/i);

  if (photoMatch && photoMatch[1] && photoMatch[2]) {
    return `/cars/${photoMatch[1]}/photos/${photoMatch[2]}/file`;
  }
  if (docMatch && docMatch[1] && docMatch[2]) {
    return `/cars/${docMatch[1]}/documents/${docMatch[2]}/file`;
  }
  if (bookingDocMatch && bookingDocMatch[1] && bookingDocMatch[2]) {
    return `/bookings/${bookingDocMatch[1]}/documents/${bookingDocMatch[2]}/file`;
  }
  if (refurbMatch && refurbMatch[1]) {
    return `/refurbishment/items/${refurbMatch[1]}/file`;
  }
  return rawUrl.replace(/^\/?api\/v1\//, "/");
}

/**
 * Fetches `src` as an authenticated blob (same-origin backend stream — no CORS)
 * and returns an object: URL for it. Shared by AuthenticatedImage and
 * AuthenticatedIframe so there's one fetch/rewrite/cleanup implementation.
 */
export function useAuthenticatedObjectUrl(src?: string | null) {
  const isDirectUrl = !!src && (src.startsWith("blob:") || src.startsWith("data:"));

  const [objectUrl, setObjectUrl] = useState<string | null>(isDirectUrl ? src! : null);
  const [isLoading, setIsLoading] = useState<boolean>(!isDirectUrl && !!src);
  const [isError, setIsError] = useState<boolean>(!src);

  useEffect(() => {
    let isMounted = true;
    let createdUrl: string | null = null;

    async function fetchFile() {
      if (!src) {
        if (!isMounted) return;
        setIsError(true);
        setIsLoading(false);
        return;
      }

      if (src.startsWith("blob:") || src.startsWith("data:")) {
        if (!isMounted) return;
        setObjectUrl(src);
        setIsLoading(false);
        setIsError(false);
        return;
      }

      setIsLoading(true);
      setIsError(false);

      try {
        // Backend-relative paths (e.g. /cars/:id/photos/:photoId/file) go straight
        // through; a raw S3/CDN url or url with /api/v1 prefix is normalized to a
        // base-relative stream endpoint (see toBackendStreamUrl above).
        let fetchUrl = toBackendStreamUrl(src!);
        if (fetchUrl.startsWith("/api/v1/")) {
          fetchUrl = fetchUrl.slice(7);
        } else if (fetchUrl.startsWith("api/v1/")) {
          fetchUrl = "/" + fetchUrl.slice(7);
        }

        const res = await apiClient.get(fetchUrl, { responseType: "blob" });
        if (!isMounted) return;

        const blob = res.data;
        if (!blob || !(blob instanceof Blob) || blob.size === 0) {
          throw new Error("Invalid file blob");
        }

        createdUrl = URL.createObjectURL(blob);
        setObjectUrl(createdUrl);
        setIsLoading(false);
      } catch {
        if (!isMounted) return;
        setIsError(true);
        setIsLoading(false);
      }
    }

    void fetchFile();

    return () => {
      isMounted = false;
      if (createdUrl) {
        URL.revokeObjectURL(createdUrl);
      }
    };
  }, [src]);

  return { objectUrl, isLoading, isError };
}

export interface AuthenticatedImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> {
  /** A backend-relative stream endpoint (e.g. `/cars/:id/photos/:photoId/file`) — never a direct S3/presigned URL. */
  src?: string | null;
  alt?: string;
  className?: string;
  fallbackIcon?: React.ReactNode;
  loadingClassName?: string;
  errorClassName?: string;
}

export function AuthenticatedImage({
  src,
  alt = "",
  className = "",
  fallbackIcon,
  loadingClassName = "",
  errorClassName = "",
  ...props
}: AuthenticatedImageProps) {
  const { objectUrl, isLoading, isError } = useAuthenticatedObjectUrl(src);

  if (isLoading) {
    return (
      <div
        className={`flex items-center justify-center bg-inset text-ink-subtle animate-pulse ${
          loadingClassName || className
        }`}
      >
        <Loader2 className="h-4 w-4 animate-spin shrink-0 text-ink-subtle" />
      </div>
    );
  }

  if (isError || !objectUrl) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-inset text-ink-subtle p-2 text-center ${
          errorClassName || className
        }`}
      >
        {fallbackIcon || <ImageOff className="h-4 w-4 stroke-1 shrink-0 text-ink-subtle" />}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={objectUrl} alt={alt} className={className} {...props} />
  );
}

export interface AuthenticatedIframeProps
  extends Omit<React.IframeHTMLAttributes<HTMLIFrameElement>, "src"> {
  /** A backend-relative stream endpoint (e.g. `/cars/:id/documents/:docId/file`) — never a direct S3/presigned URL. */
  src?: string | null;
  className?: string;
  loadingClassName?: string;
  errorClassName?: string;
}

/** Same authenticated-blob-stream approach as AuthenticatedImage, for PDF previews. */
export function AuthenticatedIframe({
  src,
  className = "",
  loadingClassName = "",
  errorClassName = "",
  ...props
}: AuthenticatedIframeProps) {
  const { objectUrl, isLoading, isError } = useAuthenticatedObjectUrl(src);

  if (isLoading) {
    return (
      <div
        className={`flex items-center justify-center bg-inset text-ink-subtle animate-pulse ${
          loadingClassName || className
        }`}
      >
        <Loader2 className="h-5 w-5 animate-spin shrink-0 text-ink-subtle" />
      </div>
    );
  }

  if (isError || !objectUrl) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-1.5 bg-inset text-ink-subtle p-4 text-center text-xs font-medium ${
          errorClassName || className
        }`}
      >
        <FileWarning className="h-5 w-5 stroke-1 shrink-0 text-ink-subtle" />
        Couldn&apos;t load document
      </div>
    );
  }

  return <iframe src={objectUrl} className={className} {...props} />;
}
