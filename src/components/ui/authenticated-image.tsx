"use client";

import React, { useState, useEffect } from "react";
import { apiClient } from "@/src/lib/api-client";
import { Loader2, ImageOff } from "lucide-react";

export interface AuthenticatedImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> {
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
  const isDirectUrl = !!src && (src.startsWith("blob:") || src.startsWith("data:"));

  const [objectUrl, setObjectUrl] = useState<string | null>(isDirectUrl ? src : null);
  const [isLoading, setIsLoading] = useState<boolean>(!isDirectUrl && !!src);
  const [isError, setIsError] = useState<boolean>(!src);

  useEffect(() => {
    if (!src) {
      return;
    }

    if (src.startsWith("blob:") || src.startsWith("data:")) {
      return;
    }

    let isMounted = true;
    let createdUrl: string | null = null;

    async function fetchImage() {
      try {
        let fetchUrl = src!;

        // Transform URL patterns if needed (same as file-actions.ts)
        const photoMatch = fetchUrl.match(/cars\/([a-f0-9\-]+)\/photos\/([a-f0-9\-]+)/i);
        const docMatch = fetchUrl.match(/cars\/([a-f0-9\-]+)\/documents\/([a-f0-9\-]+)/i);
        const bookingDocMatch = fetchUrl.match(/(?:bookings|booking-documents)\/([a-f0-9\-]+)\/(?:documents\/)?([a-f0-9\-]+)/i);
        const refurbMatch = fetchUrl.match(/refurbishment\/items\/([a-f0-9\-]+)/i);

        if (photoMatch && photoMatch[1] && photoMatch[2]) {
          fetchUrl = `/cars/${photoMatch[1]}/photos/${photoMatch[2]}/file`;
        } else if (docMatch && docMatch[1] && docMatch[2]) {
          fetchUrl = `/cars/${docMatch[1]}/documents/${docMatch[2]}/file`;
        } else if (bookingDocMatch && bookingDocMatch[1] && bookingDocMatch[2]) {
          fetchUrl = `/bookings/${bookingDocMatch[1]}/documents/${bookingDocMatch[2]}/file`;
        } else if (refurbMatch && refurbMatch[1]) {
          fetchUrl = `/refurbishment/items/${refurbMatch[1]}/file`;
        }

        const res = await apiClient.get(fetchUrl, { responseType: "blob" });
        if (!isMounted) return;

        const blob = res.data;
        if (!blob || !(blob instanceof Blob) || blob.size === 0) {
          throw new Error("Invalid image blob");
        }

        createdUrl = URL.createObjectURL(blob);
        setObjectUrl(createdUrl);
        setIsLoading(false);
      } catch {
        if (!isMounted) return;

        // If apiClient failed (e.g. CORS on third-party public URL), try native fetch if absolute http URL
        if (src!.startsWith("http://") || src!.startsWith("https://")) {
          try {
            const res = await fetch(src!);
            if (res.ok) {
              const blob = await res.blob();
              if (isMounted && blob && blob.size > 0) {
                createdUrl = URL.createObjectURL(blob);
                setObjectUrl(createdUrl);
                setIsLoading(false);
                return;
              }
            }
          } catch {
            // ignore fallback failure
          }
        }

        if (!isMounted) return;
        setIsError(true);
        setIsLoading(false);
      }
    }

    void fetchImage();

    return () => {
      isMounted = false;
      if (createdUrl) {
        URL.revokeObjectURL(createdUrl);
      }
    };
  }, [src]);

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
    <img
      src={objectUrl}
      alt={alt}
      className={className}
      {...props}
    />
  );
}
