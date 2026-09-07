/* eslint-disable security/detect-object-injection */
"use client";

import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import {
  FileText,
  UploadCloud,
  Trash2,
  Eye,
  Loader2,
  Check,
  X,
  Share2,
  Plus,
  Download,
} from "lucide-react";
import { useBooking } from "../hooks/use-booking";
import {
  useBookingDocuments,
  useBookingDocumentActions,
} from "../hooks/use-booking-documents";
import type { BookingDocumentFile } from "../types/booking-types";
import { ConfirmModal } from "@/src/components/ui/confirm-modal";
import { downloadFile, shareFile } from "@/src/lib/file-action-utils";
import { AuthenticatedImage } from "@/src/components/ui/authenticated-image";

interface BookingDocumentsCardProps {
  bookingId: string;
  docType: "rc_transfer" | "delivery_image";
  title: string;
  description: string;
  required?: boolean;
  readOnly?: boolean;
  onFilesCountChange?: (count: number) => void;
}

function buildCleanDocName(
  doc: { original_name?: string; file_name?: string; mime_type?: string },
  docType: "rc_transfer" | "delivery_image",
  bookingNumber?: string,
  regNumber?: string
): string {
  const ext = doc.mime_type === "application/pdf" ? ".pdf" : ".jpg";
  const raw = doc.original_name || doc.file_name || "";
  const isRawKey =
    !raw ||
    /^[0-9a-f]{16,}/i.test(raw) ||
    /^\d{10}_[0-9a-f]/i.test(raw) ||
    /^blob$/i.test(raw);

  if (!isRawKey) {
    const clean = raw.replace(/\.[a-zA-Z0-9]+$/, "").trim();
    return `${clean}${ext}`;
  }

  const prefix = regNumber
    ? regNumber.replace(/[^a-zA-Z0-9-]/g, "")
    : bookingNumber || "Booking";
  if (docType === "rc_transfer") {
    return `${prefix}-RC-Transfer-Proof${ext}`;
  }
  return `${prefix}-Delivery-Handover-Photo${ext}`;
}

export function BookingDocumentsCard({
  bookingId,
  docType,
  title,
  description,
  required = false,
  readOnly = false,
  onFilesCountChange,
}: BookingDocumentsCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: booking } = useBooking(bookingId);
  const { data: documentsGroup = {}, isLoading } =
    useBookingDocuments(bookingId);
  const { uploadDocuments, deleteDocument, isUploading, isDeleting } =
    useBookingDocumentActions(bookingId);

  const docGroup = documentsGroup[docType];
  const files: BookingDocumentFile[] = docGroup?.files || [];
  const count = files.length;
  const hasPdf =
    files.some((f) => f.mime_type === "application/pdf") ||
    docGroup?.kind === "pdf";
  const isUploaded = count > 0;

  useEffect(() => {
    onFilesCountChange?.(count);
  }, [count, onFilesCountChange]);

  const [previewItem, setPreviewItem] = useState<{
    id: string;
    url: string;
    streamUrl: string;
    mimeType: string;
    name?: string;
  } | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await deleteDocument(deleteTargetId);
    } catch {
      // Error toast handled in hook
    } finally {
      setDeleteTargetId(null);
    }
  };

  const handleCardClick = () => {
    if (readOnly) return;
    if (hasPdf) {
      toast.error(
        "PDF document is complete. Delete the existing file to upload a new one."
      );
      return;
    }
    if (count >= 20) {
      toast.error("Maximum 20 images uploaded for this document type.");
      return;
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    const pdfsInBatch = selectedFiles.filter(
      (f) => f.type === "application/pdf"
    );
    const imagesInBatch = selectedFiles.filter((f) =>
      f.type.startsWith("image/")
    );

    // Validation checks
    if (docType === "delivery_image" && pdfsInBatch.length > 0) {
      toast.error(
        "PDF files are not allowed for delivery_image (images only)."
      );
      return;
    }

    if (pdfsInBatch.length > 0 && imagesInBatch.length > 0) {
      toast.error("Cannot mix PDF and image files for a single document type.");
      return;
    }
    if (pdfsInBatch.length > 1) {
      toast.error("Only 1 PDF file is allowed per document type.");
      return;
    }
    if (hasPdf) {
      toast.error(
        "PDF document is complete. Delete the existing file to upload a new one."
      );
      return;
    }
    if (!hasPdf && count > 0 && pdfsInBatch.length > 0) {
      toast.error(
        "Cannot upload a PDF to a document type that already contains images."
      );
      return;
    }
    if (imagesInBatch.length > 0 && count + imagesInBatch.length > 20) {
      toast.error(
        `Uploading ${imagesInBatch.length} images would exceed maximum of 20 images (currently has ${count}).`
      );
      return;
    }

    await uploadDocuments({ files: selectedFiles, docType });
  };

  const handleViewPreview = (doc: BookingDocumentFile) => {
    const backendStreamUrl = `/bookings/${bookingId}/documents/${doc.id}/file`;
    const cleanName = buildCleanDocName(
      doc,
      docType,
      booking?.booking_number,
      booking?.car?.reg_number
    );
    setPreviewItem({
      id: doc.id,
      url: doc.presigned_url || backendStreamUrl,
      streamUrl: backendStreamUrl,
      mimeType: doc.mime_type || "image/jpeg",
      name: cleanName,
    });
  };

  const handleDownloadDoc = async (doc: BookingDocumentFile) => {
    const backendStreamUrl = `/bookings/${bookingId}/documents/${doc.id}/file`;
    const cleanName = buildCleanDocName(
      doc,
      docType,
      booking?.booking_number,
      booking?.car?.reg_number
    );
    await downloadFile({
      url: backendStreamUrl,
      fileName: cleanName,
      title: title,
      mimeType: doc.mime_type,
    });
  };

  const handleShareDoc = async (doc: BookingDocumentFile) => {
    const backendStreamUrl = `/bookings/${bookingId}/documents/${doc.id}/file`;
    const cleanName = buildCleanDocName(
      doc,
      docType,
      booking?.booking_number,
      booking?.car?.reg_number
    );
    await shareFile({
      url: backendStreamUrl,
      fileName: cleanName,
      title: `${title} - Booking Document`,
      text: title,
      mimeType: doc.mime_type,
    });
  };

  if (isLoading) {
    return (
      <div className="h-44 w-full animate-pulse rounded-2xl bg-inset border border-line" />
    );
  }

  let cardContainerStyle = "border-line bg-card hover:border-line-focus";
  let iconBoxStyle = "bg-inset text-ink-subtle border border-line";

  if (isUploaded) {
    cardContainerStyle = "border-emerald-500/40 bg-emerald-500/[0.03]";
    iconBoxStyle = "bg-emerald-600 text-white";
  }

  const acceptPattern =
    docType === "delivery_image"
      ? "image/jpeg, image/png, image/webp"
      : "image/jpeg, image/png, image/webp, application/pdf";

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple={!hasPdf}
        accept={acceptPattern}
        className="hidden"
      />

      <div
        className={`flex flex-col justify-between rounded-2xl border p-4.5 transition-all select-none font-sans ${cardContainerStyle}`}
      >
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3 min-w-0">
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-colors ${iconBoxStyle}`}
              >
                {isUploaded ? (
                  <Check className="h-4 w-4 stroke-[3px]" />
                ) : (
                  <FileText className="h-4 w-4 stroke-[2px]" />
                )}
              </span>

              <div className="min-w-0">
                <h3 className="text-xs font-bold text-ink font-sans truncate">
                  {title}
                </h3>

                {isUploaded ? (
                  <span className="inline-flex items-center gap-1 mt-0.5 text-[10px] font-bold tracking-tight text-emerald-700 dark:text-emerald-400">
                    ✓{" "}
                    {hasPdf
                      ? "PDF Uploaded"
                      : `${count} Image${count > 1 ? "s" : ""}`}
                  </span>
                ) : (
                  <span
                    className={`inline-block mt-0.5 text-[9px] font-mono font-bold uppercase tracking-wider ${
                      required
                        ? "text-rose-600 dark:text-rose-400 font-extrabold"
                        : "text-ink-subtle"
                    }`}
                  >
                    {required ? "Required" : "Optional"}
                  </span>
                )}
              </div>
            </div>

            {!hasPdf && isUploaded && (
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-inset text-ink-muted border border-line">
                {count}/20
              </span>
            )}
          </div>

          <p className="text-[11px] font-medium text-ink-muted leading-relaxed line-clamp-2">
            {description}
          </p>

          {/* Card Content - PDF or Images Grid */}
          {isUploaded && (
            <div className="pt-2">
              {hasPdf ? (
                /* PDF File Item */
                <div className="flex items-center justify-between rounded-xl border border-line bg-inset/80 p-2.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText className="h-4 w-4 text-rose-500 shrink-0 stroke-[2px]" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-ink truncate">
                        {files[0]?.original_name ||
                          files[0]?.file_name ||
                          "Document.pdf"}
                      </p>
                      <span className="text-[9px] font-mono text-ink-subtle">
                        PDF Document
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Images Grid */
                <div className="flex flex-wrap gap-2.5 pt-1">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      onClick={() => handleViewPreview(file)}
                      className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-xl overflow-hidden border border-line bg-inset group/thumb cursor-pointer shrink-0 shadow-2xs hover:shadow-md transition-all"
                    >
                      <AuthenticatedImage
                        src={`/bookings/${bookingId}/documents/${file.id}/file`}
                        alt={file.original_name || file.file_name}
                        className="h-full w-full object-cover transition-transform duration-200 group-hover/thumb:scale-105"
                      />

                      {/* Action Overlay */}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-1.5 opacity-90 transition-opacity hover:opacity-100">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewPreview(file);
                          }}
                          className="h-7 w-7 rounded-lg bg-white/30 hover:bg-white/50 text-white flex items-center justify-center transition-colors cursor-pointer border border-white/20"
                          title="View image"
                        >
                          <Eye className="h-3.5 w-3.5 stroke-[2.25px]" />
                        </button>
                        {!readOnly && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteTargetId(file.id);
                            }}
                            className="h-7 w-7 rounded-lg bg-rose-600/90 hover:bg-rose-600 text-white flex items-center justify-center transition-colors cursor-pointer border border-rose-500/30"
                            title="Delete image"
                          >
                            <Trash2 className="h-3.5 w-3.5 stroke-[2.25px]" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Card Action Controls Footer */}
        <div className="mt-4 border-t border-line/60 pt-3">
          {isUploaded ? (
            <div className="flex items-center justify-between gap-1.5">
              {hasPdf ? (
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleDownloadDoc(files[0])}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 transition-colors cursor-pointer"
                    >
                      <Eye className="h-3.5 w-3.5 stroke-[2.5px]" />
                      View PDF
                    </button>

                    <button
                      type="button"
                      onClick={() => handleShareDoc(files[0])}
                      className="inline-flex items-center gap-1 text-xs font-bold text-ink-muted hover:text-ink transition-colors cursor-pointer px-1.5 py-0.5 rounded-md hover:bg-inset"
                      title="Share document"
                    >
                      <Share2 className="h-3.5 w-3.5 stroke-[2.5px]" />
                      <span>Share</span>
                    </button>
                  </div>

                  {!readOnly && (
                    <button
                      type="button"
                      onClick={() => setDeleteTargetId(files[0]?.id)}
                      disabled={isDeleting}
                      className="inline-flex items-center justify-center h-7 w-7 rounded-lg text-ink-subtle hover:text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer disabled:opacity-50 shrink-0"
                      title="Delete document"
                    >
                      <Trash2 className="h-3.5 w-3.5 stroke-[2px]" />
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-between w-full">
                  {!readOnly && count < 20 ? (
                    <button
                      type="button"
                      disabled={isUploading}
                      onClick={handleCardClick}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-accent hover:text-accent-hover transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin stroke-[2.5px]" />
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Plus className="h-3.5 w-3.5 stroke-[2.5px]" />
                          <span>Add More Images</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <span className="text-[10px] font-bold text-ink-subtle italic">
                      {count >= 20 ? "Max 20 images reached" : ""}
                    </span>
                  )}

                  <span className="text-[10px] font-mono text-ink-subtle">
                    {count} file{count > 1 ? "s" : ""}
                  </span>
                </div>
              )}
            </div>
          ) : !readOnly ? (
            <button
              type="button"
              disabled={isUploading}
              onClick={handleCardClick}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-line bg-card text-ink hover:bg-inset px-3 py-2 text-xs font-bold transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-ink stroke-[2.5px]" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="h-3.5 w-3.5 stroke-[2px] text-ink-subtle" />
                  <span>Upload Files</span>
                </>
              )}
            </button>
          ) : (
            <span className="text-xs text-ink-subtle italic">
              No files uploaded
            </span>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Document"
        description="Are you sure you want to delete this document? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />

      {/* Document / Image Preview Lightbox Modal with Download & Share */}
      {previewItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-3 sm:p-6 select-none font-sans"
          onClick={() => setPreviewItem(null)}
        >
          <div
            className="relative flex flex-col max-h-[92vh] max-w-5xl w-full rounded-2xl bg-card shadow-2xl overflow-hidden border border-line"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-line px-5 py-3.5 bg-card z-10">
              <div className="flex items-center gap-2 min-w-0">
                <h3 className="text-sm font-bold tracking-tight text-ink font-sans truncate">
                  {previewItem.name || title}
                </h3>
                {previewItem.mimeType === "application/pdf" && (
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded-md shrink-0">
                    PDF Document
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {(() => {
                  const rawDocName = previewItem.name || title || `${docType}-document`;
                  const ext = previewItem.mimeType === "application/pdf" ? ".pdf" : ".jpg";
                  const cleanFileName = rawDocName.endsWith(ext) ? rawDocName : `${rawDocName}${ext}`;

                  return (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          downloadFile({
                            url: previewItem.streamUrl || `/bookings/${bookingId}/documents/${previewItem.id}/file`,
                            fileName: cleanFileName,
                            title: title,
                            mimeType: previewItem.mimeType,
                          })
                        }
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-ink-muted hover:text-ink transition-colors px-2.5 py-1.5 rounded-lg bg-inset hover:bg-line/40 border border-line cursor-pointer"
                        title="Download File"
                      >
                        <Download className="h-3.5 w-3.5 stroke-[2px]" />
                        <span className="hidden sm:inline">Download</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          shareFile({
                            url: previewItem.streamUrl || `/bookings/${bookingId}/documents/${previewItem.id}/file`,
                            fileName: cleanFileName,
                            title: `${title} - Booking Document`,
                            text: title,
                            mimeType: previewItem.mimeType,
                          })
                        }
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-500/10 hover:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-500/20 transition-all px-2.5 py-1.5 rounded-lg cursor-pointer"
                        title="Share File"
                      >
                        <Share2 className="h-3.5 w-3.5 stroke-[2px]" />
                        <span className="hidden sm:inline">Share</span>
                      </button>
                    </>
                  );
                })()}

                <button
                  type="button"
                  onClick={() => setPreviewItem(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-subtle hover:bg-inset hover:text-ink transition-colors cursor-pointer"
                  title="Close preview"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-hidden bg-inset p-3 flex items-center justify-center min-h-[60vh]">
              {previewItem.mimeType === "application/pdf" ? (
                <iframe
                  src={previewItem.url}
                  title={previewItem.name || title}
                  className="w-full h-[75vh] min-h-[480px] rounded-xl border border-line bg-card shadow-xs"
                />
              ) : (
                <AuthenticatedImage
                  src={previewItem.url}
                  alt={previewItem.name || title}
                  className="max-h-[75vh] w-auto max-w-full rounded-xl shadow-sm object-contain"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
