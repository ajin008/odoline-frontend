import { toast } from "sonner";

export interface FileActionOptions {
  url: string;
  filename: string;
  title?: string;
  text?: string;
  mimeType?: string;
}

/**
 * Sanitizes a string to be safe for filenames.
 */
export function sanitizeFilename(
  name: string,
  fallback: string = "document"
): string {
  if (!name) return fallback;
  return name.replace(/[^a-zA-Z0-9_\-\.]/g, "_").replace(/_+/g, "_");
}

/**
 * Infers proper MIME type, sanitized filename, and extension from URL/blob metadata.
 */
export function inferMimeAndExtension(
  url: string,
  providedFilename: string,
  providedMime?: string,
  blobType?: string
): { mimeType: string; cleanFilename: string; ext: string } {
  let mime = providedMime;
  if (!mime && blobType && blobType !== "application/octet-stream" && blobType.trim() !== "") {
    mime = blobType;
  }

  const urlOrName = (providedFilename + " " + url).toLowerCase();
  if (!mime) {
    if (urlOrName.includes(".pdf")) mime = "application/pdf";
    else if (urlOrName.includes(".png")) mime = "image/png";
    else if (urlOrName.includes(".webp")) mime = "image/webp";
    else if (urlOrName.includes(".jpg") || urlOrName.includes(".jpeg")) mime = "image/jpeg";
    else mime = "application/pdf";
  }

  let ext = ".pdf";
  if (mime.includes("jpeg") || mime.includes("jpg")) ext = ".jpg";
  else if (mime.includes("png")) ext = ".png";
  else if (mime.includes("webp")) ext = ".webp";
  else if (mime.includes("pdf")) ext = ".pdf";
  else if (mime.includes("svg")) ext = ".svg";
  else {
    const match = (providedFilename || url).match(/\.([a-zA-Z0-9]+)(\?|$)/);
    if (match && match[1]) {
      ext = `.${match[1]}`;
    }
  }

  let baseName = sanitizeFilename(providedFilename, "document");

  if (/^(blob|file)$/i.test(baseName)) {
    baseName = "document";
  }

  baseName = baseName.replace(/[-_.]blob$/i, "");

  if (!baseName.toLowerCase().endsWith(ext.toLowerCase())) {
    baseName = baseName.replace(/\.[a-zA-Z0-9]+$/, "") + ext;
  }

  return {
    mimeType: mime,
    cleanFilename: baseName,
    ext,
  };
}

/**
 * Downloads a file with a specified descriptive filename.
 * Platform-aware:
 * - On Mobile / Tablet (if native file sharing capability `canShare({ files })` is supported),
 *   opens the native share/save sheet ("Save to Files" / "Save to Photos").
 * - On Desktop (or if file sharing unsupported), triggers direct `<a download>` link click.
 */
export async function downloadFile({
  url,
  filename,
  title,
  mimeType: providedMime,
}: FileActionOptions): Promise<void> {
  const toastId = toast.loading("Downloading file...");

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Fetch failed: ${response.status}`);
    }
    const blob = await response.blob();
    if (!blob || blob.size === 0) {
      throw new Error("Empty file");
    }

    const { mimeType: resolvedMime, cleanFilename } = inferMimeAndExtension(
      url,
      filename,
      providedMime,
      blob.type
    );

    const file = new File([blob], cleanFilename, { type: resolvedMime });
    const shareTitle = title || cleanFilename;

    // Mobile / Tablet capability detection: check if native file sharing is supported
    let canShareFiles = false;
    if (
      typeof navigator !== "undefined" &&
      typeof navigator.canShare === "function" &&
      typeof navigator.share === "function"
    ) {
      try {
        canShareFiles = navigator.canShare({ files: [file] });
      } catch {
        canShareFiles = false;
      }
    }

    if (canShareFiles) {
      toast.dismiss(toastId);
      try {
        await navigator.share({
          title: shareTitle,
          files: [file],
        });
        toast.success("File ready / saved");
        return;
      } catch (err: unknown) {
        if ((err as { name?: string })?.name === "AbortError") {
          // User cancelled native share sheet -> NOT an error
          return;
        }
        // Fall back to desktop download path if native share throws an unexpected error
      }
    }

    // Desktop path (or fallback if native file share is unsupported):
    const blobUrl = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = cleanFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setTimeout(() => {
      URL.revokeObjectURL(blobUrl);
    }, 5000);

    toast.success("Downloaded", { id: toastId });
  } catch (err: unknown) {
    // eslint-disable-next-line no-console
    console.error("Failed to download file:", err);
    toast.error("Download failed, please retry", { id: toastId });
  }
}

/**
 * Shares a file via Web Share API (with file attachment if supported),
 * or downloads the file and opens WhatsApp share fallback.
 */
export async function shareFile({
  url,
  filename,
  title,
  text,
  mimeType: providedMime,
}: FileActionOptions): Promise<void> {
  const toastId = toast.loading("Preparing file for sharing...");

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Fetch failed: ${response.status}`);
    }
    const blob = await response.blob();
    if (!blob || blob.size === 0) {
      throw new Error("Empty file");
    }

    const { mimeType: resolvedMime, cleanFilename } = inferMimeAndExtension(
      url,
      filename,
      providedMime,
      blob.type
    );

    const file = new File([blob], cleanFilename, { type: resolvedMime });
    const shareTitle = title || cleanFilename;

    let canShareFiles = false;
    if (
      typeof navigator !== "undefined" &&
      typeof navigator.canShare === "function" &&
      typeof navigator.share === "function"
    ) {
      try {
        canShareFiles = navigator.canShare({ files: [file] });
      } catch {
        canShareFiles = false;
      }
    }

    if (canShareFiles) {
      toast.dismiss(toastId);
      try {
        await navigator.share({
          title: shareTitle,
          text: text || shareTitle,
          files: [file],
        });
        toast.success("Shared successfully");
        return;
      } catch (err: unknown) {
        if ((err as { name?: string })?.name === "AbortError") {
          return;
        }
      }
    }

    // Fallback if native file sharing is unavailable or fails:
    // Automatically trigger download and open WhatsApp share.
    toast.dismiss(toastId);
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = cleanFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setTimeout(() => {
      URL.revokeObjectURL(blobUrl);
    }, 5000);

    const shareText = `📄 *${shareTitle}*${text ? `\n${text}` : ""}`;
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      shareText
    )}`;
    window.open(waUrl, "_blank");
    toast.success("Downloaded file & opened WhatsApp share");
  } catch (err: unknown) {
    // eslint-disable-next-line no-console
    console.error("Failed to share file:", err);
    toast.error("Download failed, please retry", { id: toastId });
  }
}
