"use client";

// Single shared "View" modal for every PDF/image document across the app
// (booking agreement, order form, settlement form, delivery note, RC transfer,
// delivery handover photos, dossier documents, ...). Previously each stage
// component reimplemented its own "View" behaviour — some opened a new browser
// tab via window.open(), others rendered a bespoke in-page lightbox with
// drifted styling/feature-set. This component is the ONE place that decides
// how a document is previewed and gives Download/Share consistently, in the
// modal header, everywhere.
import { useEffect, useState } from "react";
import { X, Download, Share2 } from "lucide-react";
import { downloadFile, shareFile } from "@/src/lib/file-actions";
import { AuthenticatedIframe, AuthenticatedImage } from "@/src/components/ui/authenticated-image";

export interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Header title shown in the modal, and used as a fallback for share title/filename. */
  title: string;
  /** Desired downloaded/shared file name (extension auto-corrected from mimeType). */
  fileName: string;
  /** Known mime type. Defaults to "application/pdf" when neither this nor a fetched blob's type is available. */
  mimeType?: string;
  /**
   * A backend-relative stream endpoint (e.g. `/bookings/:id/documents/:docId/file`) — never a
   * direct S3/presigned URL. Provide this OR `fetchBlob`.
   */
  src?: string;
  /** Custom blob fetcher (e.g. `() => bookingApi.getAgreementPdf(id)`). Provide this OR `src`. */
  fetchBlob?: () => Promise<Blob>;
  /** Optional share caption; defaults to `title`. */
  shareText?: string;
}

/** True if `mimeType` should render as an image rather than a PDF iframe. */
function isImageMime(mimeType?: string): boolean {
  return !!mimeType && mimeType.startsWith("image/");
}

export function DocumentPreviewModal({
  isOpen,
  onClose,
  title,
  fileName,
  mimeType = "application/pdf",
  src,
  fetchBlob,
  shareText,
}: DocumentPreviewModalProps) {
  // When given fetchBlob (rather than a backend-stream `src`), fetch once on
  // open and hand the resulting blob: URL to AuthenticatedIframe/Image, which
  // recognizes blob: URLs and renders them directly (no further network call).
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState(false);
  const isFetchingBlob = Boolean(fetchBlob) && !blobUrl && !fetchError;

  useEffect(() => {
    if (!isOpen || !fetchBlob) return;
    let cancelled = false;
    let createdUrl: string | null = null;

    fetchBlob()
      .then((blob) => {
        if (cancelled) return;
        createdUrl = URL.createObjectURL(blob);
        setBlobUrl(createdUrl);
      })
      .catch(() => {
        if (!cancelled) setFetchError(true);
      });

    return () => {
      cancelled = true;
      if (createdUrl) URL.revokeObjectURL(createdUrl);
      setBlobUrl(null);
      setFetchError(false);
    };
  }, [isOpen, fetchBlob]);

  if (!isOpen) return null;

  const previewSrc = fetchBlob ? blobUrl : src;
  const ext = mimeType.includes("pdf")
    ? ".pdf"
    : mimeType.includes("png")
      ? ".png"
      : mimeType.includes("webp")
        ? ".webp"
        : ".jpg";
  const cleanFileName = fileName.endsWith(ext) ? fileName : `${fileName}${ext}`;

  const handleDownload = () =>
    downloadFile({ url: src, fetchBlob, fileName: cleanFileName, title, mimeType });

  const handleShare = () =>
    shareFile({
      url: src,
      fetchBlob,
      fileName: cleanFileName,
      title,
      text: shareText || title,
      mimeType,
    });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-3 sm:p-6 select-none font-sans"
      onClick={onClose}
    >
      <div
        className="relative flex flex-col max-h-[92vh] max-w-5xl w-full rounded-2xl bg-card shadow-2xl overflow-hidden border border-line"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-line px-5 py-3.5 bg-card z-10">
          <div className="flex items-center gap-2 min-w-0">
            <h3 className="text-sm font-bold tracking-tight text-ink font-sans truncate">
              {title}
            </h3>
            {mimeType === "application/pdf" && (
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded-md shrink-0">
                PDF Document
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-ink-muted hover:text-ink transition-colors px-2.5 py-1.5 rounded-lg bg-inset hover:bg-line/40 border border-line cursor-pointer"
              title="Download File"
            >
              <Download className="h-3.5 w-3.5 stroke-[2px]" />
              <span className="hidden sm:inline">Download</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-500/10 hover:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-500/20 transition-all px-2.5 py-1.5 rounded-lg cursor-pointer"
              title="Share File"
            >
              <Share2 className="h-3.5 w-3.5 stroke-[2px]" />
              <span className="hidden sm:inline">Share</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-subtle hover:bg-inset hover:text-ink transition-colors cursor-pointer"
              title="Close preview"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-hidden bg-inset p-3 flex items-center justify-center min-h-[60vh]">
          {fetchError ? (
            <p className="text-xs font-semibold text-ink-subtle">Couldn&apos;t load document.</p>
          ) : fetchBlob && isFetchingBlob ? (
            <p className="text-xs font-semibold text-ink-subtle">Loading document…</p>
          ) : isImageMime(mimeType) ? (
            <AuthenticatedImage
              src={previewSrc}
              alt={title}
              className="max-h-[75vh] w-auto max-w-full rounded-xl shadow-sm object-contain"
            />
          ) : (
            <AuthenticatedIframe
              src={previewSrc}
              title={title}
              className="w-full h-[75vh] min-h-[480px] rounded-xl border border-line bg-card shadow-xs"
            />
          )}
        </div>
      </div>
    </div>
  );
}
