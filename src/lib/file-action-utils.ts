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
 * Downloads a file with a specified descriptive filename.
 */
export async function downloadFile({
  url,
  filename,
}: FileActionOptions): Promise<void> {
  const cleanFilename = sanitizeFilename(filename, "file");
  const toastId = toast.loading("Downloading...");

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP status ${response.status}`);
    }
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = cleanFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setTimeout(() => {
      URL.revokeObjectURL(blobUrl);
    }, 1000);

    toast.success("Downloaded", { id: toastId });
  } catch (err: unknown) {
    // eslint-disable-next-line no-console
    console.error("Failed to download file:", err);
    toast.error("Failed to download file. Please try again.", { id: toastId });
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
  mimeType,
}: FileActionOptions): Promise<void> {
  const cleanFilename = sanitizeFilename(filename, "document");
  const shareTitle = title || cleanFilename;

  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const resolvedMime =
      mimeType ||
      blob.type ||
      (cleanFilename.toLowerCase().endsWith(".pdf")
        ? "application/pdf"
        : "image/jpeg");

    const file = new File([blob], cleanFilename, { type: resolvedMime });

    if (
      typeof navigator !== "undefined" &&
      navigator.canShare &&
      navigator.canShare({ files: [file] })
    ) {
      await navigator.share({
        title: shareTitle,
        text: text || shareTitle,
        files: [file],
      });
      toast.success("Shared successfully");
      return;
    }

    if (typeof navigator !== "undefined" && navigator.share) {
      await navigator.share({
        title: shareTitle,
        text: text ? `${text}\n${shareTitle}` : shareTitle,
        url,
      });
      toast.success("Shared successfully");
      return;
    }
  } catch (err: unknown) {
    if ((err as { name?: string })?.name === "AbortError") return;
  }

  // Fallback if native file sharing is unavailable:
  // Automatically trigger download and open WhatsApp share.
  await downloadFile({ url, filename: cleanFilename });

  const shareText = `📄 *${shareTitle}*\n${text || ""}`;
  const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    shareText
  )}`;
  window.open(waUrl, "_blank");
  toast.success("Downloaded file & opened WhatsApp share");
}
