// File: src/features/booking/utils/doc-actions.ts
//
// FIX-24: thin compatibility wrapper — all real logic (fetch, sanitize,
// canShare detection, <a download>, error handling) lives in the single
// shared module src/lib/file-actions.ts. Kept only so existing
// `{ fetchBlob, filename, docTitle }`-style call sites don't need to change.
import {
  downloadFile,
  shareFile,
  buildDocFilename as coreBuildDocFilename,
} from "@/src/lib/file-actions";

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

/**
 * Downloads a PDF document. Platform-aware (see src/lib/file-actions.ts):
 * native share/save sheet on mobile, `<a download>` on desktop.
 */
export async function downloadPdfDocument({
  fetchBlob,
  filename,
  docTitle = "PDF",
}: DownloadPdfOptions): Promise<void> {
  await downloadFile({
    fetchBlob,
    fileName: filename,
    title: docTitle,
    mimeType: "application/pdf",
  });
}

/**
 * Shares a PDF document. Platform-aware (see src/lib/file-actions.ts):
 * native share sheet with the file attached on mobile; download + WhatsApp
 * Web hand-off (with a clean, never-"blob" caption) on desktop.
 */
export async function sharePdfDocument({
  fetchBlob,
  filename,
  shareTitle,
  shareText,
}: SharePdfOptions): Promise<void> {
  await shareFile({
    fetchBlob,
    fileName: filename,
    title: shareTitle,
    text: shareText,
    mimeType: "application/pdf",
  });
}

/**
 * Constructs a clean, descriptive document filename.
 * E.g.: "Advance-Agreement-Receipt-BK1746-Hamza-ali.pdf"
 */
export const buildDocFilename = coreBuildDocFilename;
