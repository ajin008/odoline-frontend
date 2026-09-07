// src/lib/file-actions.ts
//
// SINGLE SOURCE OF TRUTH for every download/share action in the app.
// FIX-24: consolidates four previously-duplicated implementations
// (src/lib/file-action-utils.ts, src/features/booking/utils/doc-actions.ts,
// src/features/cars/utils/share-car-document.ts, src/features/cars/components/car-share-modal.tsx)
// into one place. Every button/handler in the app should call `downloadFile`,
// `shareFile`, or `shareOrSaveFile` from here — nothing else should re-implement
// filename sanitization, mime resolution, platform (canShare) detection, or the
// blob-URL/<a download> mechanics.
"use client";

import { toast } from "sonner";
import { isAxiosError } from "axios";

export interface FileActionSource {
  /** Direct URL to fetch (presigned URL, static asset, iframe src, etc). Provide this OR fetchBlob. */
  url?: string;
  /** Custom blob fetcher — use for authenticated/backend-proxied downloads. Provide this OR url. */
  fetchBlob?: () => Promise<Blob>;
  /** Desired file name. Extension is corrected automatically from the resolved mime type. */
  fileName: string;
  /** Human title shown in the native share sheet / success toast. Sanitized — never "blob". */
  title?: string;
  /** Extra caption/body text for share (e.g. WhatsApp message). Sanitized — never "blob". */
  text?: string;
  /** Explicit mime type if known; otherwise inferred from the blob / fileName / url. */
  mimeType?: string;
}

class FileFetchError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.status = status;
  }
}

// ---------------------------------------------------------------------------
// Filename / title sanitization — ONE implementation, used by every caller.
// ---------------------------------------------------------------------------

/** Sanitizes a single filename segment. Never returns "blob" (or empty). */
function sanitizeNamePart(name: string, fallback = "document"): string {
  if (!name) return fallback;
  let clean = name.trim().replace(/[^a-zA-Z0-9_\-.]/g, "_").replace(/_+/g, "_");
  if (!clean || /^(blob|file)$/i.test(clean)) return fallback;
  // Strip a trailing "-blob" / "_blob" / ".blob" suffix (e.g. an upload whose
  // original_name was literally "blob", producing "KLBD2323_blob").
  clean = clean.replace(/[-_.]blob$/i, "");
  if (!clean || /^(blob|file)$/i.test(clean)) return fallback;
  return clean;
}

/**
 * Sanitizes any human-facing display string (share-sheet title, caption text).
 * This is the fix for the bug FIX-23b missed: filenames were sanitized but
 * titles/captions built from the same raw source were not, so "blob" kept
 * showing up in the native share sheet even after the saved file was renamed.
 */
function sanitizeDisplayText(text: string | undefined, fallback: string): string {
  if (!text) return fallback;
  const cleaned = text
    .replace(/\bblob\b/gi, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s*-\s*$/, "")
    .trim();
  return cleaned || fallback;
}

function resolveMimeAndExtension(
  fileName: string,
  url: string | undefined,
  providedMime: string | undefined,
  blobType: string | undefined
): { mimeType: string; ext: string } {
  let mime = providedMime;
  if (!mime && blobType && blobType !== "application/octet-stream" && blobType.trim() !== "") {
    mime = blobType;
  }

  const haystack = `${fileName} ${url || ""}`.toLowerCase();
  if (!mime) {
    if (haystack.includes(".pdf")) mime = "application/pdf";
    else if (haystack.includes(".png")) mime = "image/png";
    else if (haystack.includes(".webp")) mime = "image/webp";
    else if (haystack.includes(".jpg") || haystack.includes(".jpeg")) mime = "image/jpeg";
    else mime = "application/pdf";
  }

  let ext = ".pdf";
  if (mime.includes("jpeg") || mime.includes("jpg")) ext = ".jpg";
  else if (mime.includes("png")) ext = ".png";
  else if (mime.includes("webp")) ext = ".webp";
  else if (mime.includes("pdf")) ext = ".pdf";
  else if (mime.includes("svg")) ext = ".svg";
  else {
    const match = fileName.match(/\.([a-zA-Z0-9]+)(\?|$)/);
    if (match && match[1]) ext = `.${match[1]}`;
  }

  return { mimeType: mime, ext };
}

function buildCleanFileName(rawName: string, ext: string): string {
  let base = sanitizeNamePart(rawName, "document");
  if (!base.toLowerCase().endsWith(ext.toLowerCase())) {
    base = base.replace(/\.[a-zA-Z0-9]+$/, "") + ext;
  }
  return base;
}

/** Exposed for callers that build a booking document filename before calling downloadFile/shareFile. */
export function buildDocFilename(
  docPrefix: string,
  bookingNumber: string,
  customerName?: string | null
): string {
  const cleanName = customerName
    ? customerName.trim().replace(/[^a-zA-Z0-9\s_-]/g, "").replace(/\s+/g, "-")
    : "";
  return cleanName
    ? `${docPrefix}-${bookingNumber}-${cleanName}.pdf`
    : `${docPrefix}-${bookingNumber}.pdf`;
}

// ---------------------------------------------------------------------------
// Fetch — surfaces the REAL error instead of masking it behind a generic toast.
// ---------------------------------------------------------------------------

function httpStatusMessage(status: number): string {
  if (status === 401 || status === 403) return "File link expired or access denied — refresh the page and retry.";
  if (status === 404) return "File not found — it may have been deleted.";
  if (status >= 500) return "Server error while fetching the file — please retry.";
  return `Failed to fetch file (status ${status}).`;
}

async function toFileFetchError(err: unknown): Promise<FileFetchError> {
  if (isAxiosError(err)) {
    const status = err.response?.status;
    if (err.response?.data instanceof Blob) {
      try {
        const text = await err.response.data.text();
        const json = JSON.parse(text);
        if (json.message) return new FileFetchError(json.message, status);
      } catch {
        // ignore parse failure on blob error body
      }
    } else if (err.response?.data?.message) {
      return new FileFetchError(err.response.data.message, status);
    }
    if (status) return new FileFetchError(httpStatusMessage(status), status);
  }
  if (err instanceof Error) return new FileFetchError(err.message);
  return new FileFetchError("Failed to fetch file.");
}

async function fetchSourceBlob(source: Pick<FileActionSource, "url" | "fetchBlob">): Promise<Blob> {
  let blob: Blob;

  if (source.fetchBlob) {
    try {
      blob = await source.fetchBlob();
    } catch (err) {
      throw await toFileFetchError(err);
    }
  } else if (source.url) {
    let response: Response;
    try {
      response = await fetch(source.url);
    } catch {
      throw new FileFetchError("Network error — check your connection and retry.");
    }
    if (!response.ok) {
      throw new FileFetchError(httpStatusMessage(response.status), response.status);
    }
    blob = await response.blob();
  } else {
    throw new FileFetchError("No file source provided.");
  }

  if (!blob || blob.size === 0) {
    throw new FileFetchError("File is empty or could not be loaded.");
  }
  return blob;
}

// ---------------------------------------------------------------------------
// Platform detection — ONE implementation, used by every caller.
// ---------------------------------------------------------------------------

export function canShareFiles(files: File[]): boolean {
  if (
    typeof navigator === "undefined" ||
    typeof navigator.canShare !== "function" ||
    typeof navigator.share !== "function"
  ) {
    return false;
  }
  try {
    return navigator.canShare({ files });
  } catch {
    return false;
  }
}

function triggerAnchorDownload(blob: Blob, fileName: string): string {
  const blobUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = blobUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  return blobUrl;
}

/**
 * Lowest-level primitive: given an already-prepared File, either hands it to the
 * native share sheet (mobile) or triggers a direct `<a download>` (desktop).
 * Used directly by multi-file flows (e.g. sharing several car photos) that need
 * their own per-file business logic but must not re-implement platform detection.
 */
export async function shareOrSaveFile(
  file: File,
  title?: string
): Promise<"shared" | "downloaded" | "cancelled"> {
  const shareTitle = sanitizeDisplayText(title, file.name);

  if (canShareFiles([file])) {
    try {
      await navigator.share({ title: shareTitle, files: [file] });
      return "shared";
    } catch (err: unknown) {
      if ((err as { name?: string })?.name === "AbortError") return "cancelled";
      // fall through to direct download below — do NOT silently swallow the error
    }
  }

  triggerAnchorDownload(file, file.name);
  return "downloaded";
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Downloads a file. Platform-aware:
 * - Desktop (no native file-share support): direct `<a download>` of the blob.
 * - Mobile (native file-share supported): opens the native save/share sheet.
 *   If the user cancels, this is silent (not an error). If the sheet rejects for
 *   a real reason, we do NOT silently fall back to `<a download>` — Safari mostly
 *   ignores that attribute for blob: URLs, which is how mobile downloads used to
 *   fail silently. Instead we open the file in a new tab as a last resort so the
 *   user has something they can actually save, and surface a clear message.
 */
export async function downloadFile({
  url,
  fetchBlob,
  fileName,
  title,
  mimeType,
}: FileActionSource): Promise<void> {
  const toastId = toast.loading("Downloading file...");
  try {
    const blob = await fetchSourceBlob({ url, fetchBlob });
    const { mimeType: resolvedMime, ext } = resolveMimeAndExtension(fileName, url, mimeType, blob.type);
    const cleanFileName = buildCleanFileName(fileName, ext);
    const shareTitle = sanitizeDisplayText(title, cleanFileName);
    const file = new File([blob], cleanFileName, { type: resolvedMime });

    if (canShareFiles([file])) {
      toast.dismiss(toastId);
      try {
        await navigator.share({ title: shareTitle, files: [file] });
        toast.success("Saved");
        return;
      } catch (err: unknown) {
        if ((err as { name?: string })?.name === "AbortError") return; // user cancelled — not an error

        // Native share rejected for a real reason. Do NOT rely on <a download> here —
        // it's unreliable on mobile Safari. Open the file so the user can save it manually.
        const fallbackUrl = URL.createObjectURL(blob);
        window.open(fallbackUrl, "_blank");
        toast.error("Couldn't open the share sheet — opened the file in a new tab, save it from there.");
        setTimeout(() => URL.revokeObjectURL(fallbackUrl), 120000);
        return;
      }
    }

    // Desktop path
    const blobUrl = triggerAnchorDownload(blob, cleanFileName);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
    toast.success("Downloaded", { id: toastId });
  } catch (err: unknown) {
    const message = err instanceof FileFetchError ? err.message : "Download failed, please retry.";
    // eslint-disable-next-line no-console
    console.error("Failed to download file:", err);
    toast.error(message, {
      id: toastId,
      action: {
        label: "Retry",
        onClick: () => {
          void downloadFile({ url, fetchBlob, fileName, title, mimeType });
        },
      },
    });
  }
}

/**
 * Shares a file via the Web Share API when supported (file attaches directly to
 * WhatsApp/Telegram/etc, with a clean title/caption — never "blob"); otherwise
 * downloads the file and hands off a clean caption to WhatsApp Web.
 */
export async function shareFile({
  url,
  fetchBlob,
  fileName,
  title,
  text,
  mimeType,
}: FileActionSource): Promise<void> {
  const toastId = toast.loading("Preparing file for sharing...");
  try {
    const blob = await fetchSourceBlob({ url, fetchBlob });
    const { mimeType: resolvedMime, ext } = resolveMimeAndExtension(fileName, url, mimeType, blob.type);
    const cleanFileName = buildCleanFileName(fileName, ext);
    const shareTitle = sanitizeDisplayText(title, cleanFileName);
    const shareText = sanitizeDisplayText(text, shareTitle);
    const file = new File([blob], cleanFileName, { type: resolvedMime });

    if (canShareFiles([file])) {
      toast.dismiss(toastId);
      try {
        await navigator.share({ title: shareTitle, text: shareText, files: [file] });
        toast.success("Shared successfully");
        return;
      } catch (err: unknown) {
        if ((err as { name?: string })?.name === "AbortError") return;
        // fall through to the desktop-style fallback below
      }
    }

    // Fallback: download the file, then hand off a clean caption to WhatsApp Web.
    toast.dismiss(toastId);
    const blobUrl = triggerAnchorDownload(blob, cleanFileName);

    const waText = `📄 *${shareTitle}*${shareText && shareText !== shareTitle ? `\n${shareText}` : ""}`;
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(waText)}`;
    window.open(waUrl, "_blank");

    toast.success("Downloaded file & opened WhatsApp share");
    setTimeout(() => URL.revokeObjectURL(blobUrl), 120000);
  } catch (err: unknown) {
    const message = err instanceof FileFetchError ? err.message : "Share failed, please retry.";
    // eslint-disable-next-line no-console
    console.error("Failed to share file:", err);
    toast.error(message, {
      id: toastId,
      action: {
        label: "Retry",
        onClick: () => {
          void shareFile({ url, fetchBlob, fileName, title, text, mimeType });
        },
      },
    });
  }
}
