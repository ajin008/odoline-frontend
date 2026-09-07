// File: src/features/booking/utils/doc-actions.ts
import { toast } from "sonner";
import { isAxiosError } from "axios";

export interface DownloadPdfOptions {
  fetchBlob: () => Promise<Blob>;
  filename: string;
  docTitle?: string;
}

export interface SharePdfOptions {
  fetchBlob: () => Promise<Blob>;
  filename: string;
  shareTitle: string;
  shareText: string;
}

async function extractErrorMessage(err: unknown, fallback: string): Promise<string> {
  if (isAxiosError(err)) {
    if (err.response?.data instanceof Blob) {
      try {
        const text = await err.response.data.text();
        const json = JSON.parse(text);
        if (json.message) return json.message;
      } catch {
        // ignore parse error
      }
    } else if (err.response?.data?.message) {
      return err.response.data.message;
    }
  } else if (err instanceof Error) {
    return err.message;
  }
  return fallback;
}

function sanitizePdfFilename(filename: string, fallback: string = "document.pdf"): string {
  let clean = (filename || "").trim().replace(/[^a-zA-Z0-9_\-\.]/g, "_");
  if (!clean || /^blob$/i.test(clean)) {
    clean = fallback;
  }
  clean = clean.replace(/[-_.]blob$/i, "");
  if (!clean.toLowerCase().endsWith(".pdf")) {
    clean = `${clean.replace(/\.[a-zA-Z0-9]+$/, "")}.pdf`;
  }
  return clean;
}

/**
 * Downloads a PDF document.
 * Platform-aware:
 * - On Mobile / Tablet (if native file sharing capability `canShare({ files })` is supported),
 *   opens native share/save sheet ("Save to Files" / "Save to Photos").
 * - On Desktop (or if file sharing unsupported), triggers direct `<a download>` link click
 *   and shows a toast with a "View" action that opens the PDF in a new tab.
 */
export async function downloadPdfDocument({
  fetchBlob,
  filename,
  docTitle = "PDF",
}: DownloadPdfOptions): Promise<void> {
  try {
    const blob = await fetchBlob();
    if (!blob || blob.size === 0) {
      throw new Error(`Empty ${docTitle} file received`);
    }

    const cleanFilename = sanitizePdfFilename(filename, `${docTitle}.pdf`);
    const file = new File([blob], cleanFilename, { type: "application/pdf" });

    // Mobile / Tablet capability detection
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
      try {
        await navigator.share({
          title: docTitle,
          files: [file],
        });
        toast.success(`${docTitle} ready / saved`);
        return;
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") {
          // User cancelled native share sheet -> NOT an error
          return;
        }
        // Fall through to desktop download if native share fails
      }
    }

    // Desktop path (<a download>)
    const url = URL.createObjectURL(blob);

    // 1. Trigger file download to disk
    const a = document.createElement("a");
    a.href = url;
    a.download = cleanFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // 2. Show toast with "View" action opening in browser tab
    toast.success(`${docTitle} downloaded`, {
      action: {
        label: "View",
        onClick: () => {
          window.open(url, "_blank");
        },
      },
    });

    // Retain object URL for 2 minutes so "View" action remains valid
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 120000);
  } catch (err: unknown) {
    const message = await extractErrorMessage(err, `Failed to download ${docTitle}`);
    toast.error(message);
    throw err;
  }
}

/**
 * Platform-aware PDF document sharing:
 * - Mobile (if native file sharing supported): Opens native share sheet with PDF file attached.
 * - Desktop (or no file share support): Downloads PDF to disk, copies share text to clipboard, and shows toast with WhatsApp Web action.
 */
export async function sharePdfDocument({
  fetchBlob,
  filename,
  shareTitle,
  shareText,
}: SharePdfOptions): Promise<void> {
  try {
    const blob = await fetchBlob();
    if (!blob || blob.size === 0) {
      throw new Error("Empty PDF file received");
    }

    const cleanFilename = sanitizePdfFilename(filename, "document.pdf");
    const file = new File([blob], cleanFilename, { type: "application/pdf" });

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
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          files: [file],
        });
        return;
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") {
          // User cancelled native share sheet, ignore
          return;
        }
        // Fallback to desktop workflow if native share throws unexpected error
      }
    }

    // Desktop / Fallback workflow
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = cleanFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareText);
      }
    } catch {
      // ignore clipboard error
    }

    toast.success(
      "PDF downloaded & message copied — attach the PDF in WhatsApp Web.",
      {
        action: {
          label: "Open WhatsApp Web",
          onClick: () => {
            window.open("https://web.whatsapp.com", "_blank");
          },
        },
      }
    );

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 120000);
  } catch (err: unknown) {
    const message = await extractErrorMessage(err, "Failed to prepare document for sharing");
    toast.error(message);
    throw err;
  }
}

/**
 * Constructs a clean, descriptive document filename.
 * E.g.: "Advance-Agreement-Receipt-BK1746-Hamza-ali.pdf"
 */
export function buildDocFilename(
  docPrefix: string,
  bookingNumber: string,
  customerName?: string | null
): string {
  const cleanName = customerName
    ? customerName
        .trim()
        .replace(/[^a-zA-Z0-9\s_-]/g, "")
        .replace(/\s+/g, "-")
    : "";
  return cleanName
    ? `${docPrefix}-${bookingNumber}-${cleanName}.pdf`
    : `${docPrefix}-${bookingNumber}.pdf`;
}
