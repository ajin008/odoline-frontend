"use client";

import { useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  Trash2,
  Eye,
  Loader2,
  ArrowRight,
  AlertCircle,
  Check,
  X,
  Share2,
  Plus,
  Download,
} from "lucide-react";
import {
  DOCUMENT_CONFIGS,
  DocumentType,
  DocumentConfigItem,
  GroupedDocType,
  CarDocumentFile,
} from "../type/document-types";
import { useCarDocuments } from "../hooks/use-documents";
import { useDocumentActions } from "../hooks/use-document-actions";
import { useCar } from "../hooks/use-car";
import { shareCarDocument } from "../utils/share-car-document";
import { documentsApi } from "../api/documents-api";
import { ConfirmModal } from "@/src/components/ui/confirm-modal";
import { downloadFile, shareFile } from "@/src/lib/file-action-utils";
import { AuthenticatedImage } from "@/src/components/ui/authenticated-image";

interface DocumentsGridProps {
  carId: string;
  isWizardMode?: boolean;
}

function DocumentsGridSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-16 w-full animate-pulse rounded-xl bg-inset border border-line" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="flex h-44 flex-col justify-between rounded-xl border border-line bg-card p-4"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 animate-pulse rounded-lg bg-inset" />
                <div className="space-y-1">
                  <div className="h-3 w-20 animate-pulse rounded-md bg-inset" />
                  <div className="h-2 w-12 animate-pulse rounded-md bg-inset" />
                </div>
              </div>
              <div className="h-2 w-3/4 animate-pulse rounded-md bg-inset" />
            </div>
            <div className="border-t border-line/50 pt-2.5">
              <div className="h-8 w-full animate-pulse rounded-lg bg-inset" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DocumentsGrid({
  carId,
  isWizardMode = false,
}: DocumentsGridProps) {
  const router = useRouter();
  const pathname = usePathname();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isIntakePage = pathname.endsWith("/intake");

  const { data: car } = useCar(carId);
  const { data: documents = [], isLoading } = useCarDocuments(carId);

  const {
    uploadAndCompressFiles,
    fetchDocumentUrl,
    deleteDocument,
    isUploading,
    isDeleting,
  } = useDocumentActions(carId);

  const [selectedDocType, setSelectedDocType] = useState<DocumentType | null>(
    null
  );
  const [previewItem, setPreviewItem] = useState<{
    id?: string;
    url: string;
    mimeType: string;
    name?: string;
  } | null>(null);
  const [loadingPreviewId, setLoadingPreviewId] = useState<string | null>(null);
  const [loadingShareId, setLoadingShareId] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const handleConfirmDelete = () => {
    if (!deleteTargetId) return;
    deleteDocument(deleteTargetId);
    setDeleteTargetId(null);
  };

  const handleCardClick = (config: DocumentConfigItem) => {
    const group = (documents as GroupedDocType[]).find(
      (g) => (g.doc_type || (g as unknown as { document_type?: string }).document_type) === config.type
    );
    const existingFiles = group?.files || [];
    const hasPdf =
      existingFiles.some((f) => f.mime_type === "application/pdf") ||
      group?.kind === "pdf";

    if (hasPdf) {
      toast.error(
        "PDF document is complete. Delete the existing file to upload a new one."
      );
      return;
    }

    if (existingFiles.length >= 20) {
      toast.error("Maximum 20 images uploaded for this document type.");
      return;
    }

    setSelectedDocType(config.type);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0 || !selectedDocType) return;

    const group = (documents as GroupedDocType[]).find(
      (g) => (g.doc_type || (g as unknown as { document_type?: string }).document_type) === selectedDocType
    );
    const existingFiles = group?.files || [];
    const existingCount = existingFiles.length;
    const hasPdf =
      existingFiles.some((f) => f.mime_type === "application/pdf") ||
      group?.kind === "pdf";
    const isImageDoc =
      !hasPdf && (existingCount > 0 ? group?.kind === "image" : true);

    const pdfsInBatch = selectedFiles.filter(
      (f) => f.type === "application/pdf"
    );
    const imagesInBatch = selectedFiles.filter((f) =>
      f.type.startsWith("image/")
    );

    // Client pre-checks
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
    if (existingCount > 0 && isImageDoc && pdfsInBatch.length > 0) {
      toast.error(
        "Cannot upload a PDF to a document type that already contains images."
      );
      return;
    }
    if (isImageDoc && imagesInBatch.length > 0) {
      if (existingCount + imagesInBatch.length > 20) {
        toast.error(
          `Uploading ${imagesInBatch.length} images would exceed maximum of 20 images (currently has ${existingCount}).`
        );
        return;
      }
    }

    await uploadAndCompressFiles(selectedFiles, selectedDocType);
  };

  const handleViewPreview = async (doc: {
    id: string;
    mime_type?: string;
    original_name?: string;
    file_url?: string;
  }) => {
    if (doc.file_url) {
      setPreviewItem({
        id: doc.id,
        url: doc.file_url,
        mimeType: doc.mime_type || "image/jpeg",
        name: doc.original_name,
      });
      return;
    }

    setLoadingPreviewId(doc.id);
    const url = await fetchDocumentUrl(doc.id);
    setLoadingPreviewId(null);
    if (url) {
      setPreviewItem({
        id: doc.id,
        url,
        mimeType: doc.mime_type || "image/jpeg",
        name: doc.original_name,
      });
    }
  };

  const handleShareDocument = async (
    doc: {
      id: string;
      mime_type?: string;
      original_name?: string;
    },
    docLabel: string
  ) => {
    setLoadingShareId(doc.id);
    await shareCarDocument({
      carId,
      documentId: doc.id,
      docLabel,
      originalName: doc.original_name,
      mimeType: doc.mime_type,
      regNumber: car?.reg_number,
      makeModel: car ? `${car.make} ${car.model}` : undefined,
    });
    setLoadingShareId(null);
  };

  if (isLoading) {
    return <DocumentsGridSkeleton />;
  }

  // Completeness check
  const uploadedTypes = new Set(
    (documents as GroupedDocType[])
      .filter((g) => g.count > 0 || (g.files && g.files.length > 0))
      .map((g) => g.doc_type || (g as unknown as { document_type?: string }).document_type)
  );
  const missingHardDocs = DOCUMENT_CONFIGS.filter(
    (cfg) => cfg.isHardDoc && !uploadedTypes.has(cfg.type)
  );
  const canProceed = missingHardDocs.length === 0;

  return (
    <>
      <div className="space-y-6 select-none font-sans relative">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          accept="image/jpeg, image/png, image/webp, application/pdf"
          className="hidden"
        />

        {/* Clean Header Status Banner */}
        <div className="flex items-start justify-between gap-4 rounded-xl p-5 transition-all bg-card border border-line">
          <div className="flex items-start gap-3.5">
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white mt-0.5 ${
                canProceed ? "bg-emerald-600" : "bg-[#f5b023]"
              }`}
            >
              {canProceed ? (
                <CheckCircle2 className="h-4 w-4 stroke-[2.5px]" />
              ) : (
                <AlertCircle className="h-4 w-4 stroke-[2.5px]" />
              )}
            </div>

            <div>
              <h3 className="font-heading text-sm font-bold tracking-tight text-ink">
                {canProceed
                  ? "Mandatory Documents Complete"
                  : "Required Documents Pending"}
              </h3>
              <p className="mt-0.5 text-xs font-medium text-ink-muted leading-relaxed">
                {canProceed
                  ? "All required physical records are in place. You may proceed to refurbishment or add optional soft documents."
                  : `Please upload ${missingHardDocs
                      .map((d) => d.label)
                      .join(" and ")} to unlock the next phase.`}
              </p>
            </div>
          </div>

          <span
            className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider shrink-0 ${
              canProceed
                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                : "bg-amber-500/10 text-amber-800 dark:text-amber-300"
            }`}
          >
            {canProceed ? "Ready to Progress" : "Action Required"}
          </span>
        </div>

        {/* Grid Matrix */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DOCUMENT_CONFIGS.map((config) => {
            const group = (documents as GroupedDocType[]).find(
              (g) => (g.doc_type || (g as unknown as { document_type?: string }).document_type) === config.type
            );
            const files: CarDocumentFile[] = group?.files || [];
            const count = files.length;
            const hasPdf =
              files.some((f) => f.mime_type === "application/pdf") ||
              group?.kind === "pdf";
            const isUploaded = count > 0;
            const isThisCardUploading =
              isUploading && selectedDocType === config.type;

            let cardContainerStyle =
              "border-line bg-card hover:border-line-focus";
            let iconBoxStyle = "bg-inset text-ink-subtle border border-line";

            if (isUploaded) {
              cardContainerStyle =
                "border-emerald-500/40 bg-emerald-500/[0.03]";
              iconBoxStyle = "bg-emerald-600 text-white";
            }

            let buttonClass = "border-line bg-card text-ink hover:bg-inset";
            let buttonCustomStyle: React.CSSProperties = {};

            if (!isUploaded && isIntakePage) {
              if (config.isHardDoc) {
                buttonClass =
                  "bg-rose-600 hover:bg-rose-700 text-white border-transparent shadow-sm";
              } else {
                buttonClass =
                  "text-white border-transparent shadow-sm hover:opacity-90";
                buttonCustomStyle = { backgroundColor: "#f5b023" };
              }
            }

            return (
              <div
                key={config.type}
                className={`flex flex-col justify-between rounded-xl border p-4.5 transition-all ${cardContainerStyle}`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${iconBoxStyle}`}
                      >
                        {isUploaded ? (
                          <Check className="h-4 w-4 stroke-[3px]" />
                        ) : (
                          <FileText className="h-4 w-4 stroke-[2px]" />
                        )}
                      </span>

                      <div className="min-w-0">
                        <h3 className="text-xs font-bold text-ink font-sans truncate">
                          {config.label}
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
                              isIntakePage && config.isHardDoc
                                ? "text-rose-600 dark:text-rose-400 font-extrabold"
                                : "text-ink-subtle"
                            }`}
                          >
                            {config.isHardDoc ? "Required" : "Optional"}
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
                    {config.description}
                  </p>

                  {/* Card Content - PDF or Images Grid */}
                  {isUploaded && (
                    <div className="pt-2">
                      {hasPdf ? (
                        /* PDF File Item */
                        <div className="flex items-center justify-between rounded-lg border border-line bg-inset/80 p-2.5">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <FileText className="h-4 w-4 text-rose-500 shrink-0 stroke-[2px]" />
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-ink truncate">
                                {files[0]?.original_name || "Document.pdf"}
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
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={file.file_url || file.file_path}
                                alt={file.original_name}
                                className="h-full w-full object-cover transition-transform duration-200 group-hover/thumb:scale-105"
                              />

                              {/* Action Overlay (Always visible across mobile, tablet & desktop) */}
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2 opacity-90 transition-opacity hover:opacity-100">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewPreview(file);
                                  }}
                                  className="h-7 w-7 rounded-lg bg-white/30 hover:bg-white/50 text-white flex items-center justify-center transition-colors cursor-pointer shadow-xs border border-white/20"
                                  title="View full image"
                                >
                                  <Eye className="h-3.5 w-3.5 stroke-[2.25px]" />
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDeleteTargetId(file.id);
                                  }}
                                  className="h-7 w-7 rounded-lg bg-rose-600/90 hover:bg-rose-600 text-white flex items-center justify-center transition-colors cursor-pointer shadow-xs border border-rose-500/30"
                                  title="Delete image"
                                >
                                  <Trash2 className="h-3.5 w-3.5 stroke-[2.25px]" />
                                </button>
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
                              onClick={() => handleViewPreview(files[0])}
                              disabled={
                                loadingPreviewId === files[0]?.id ||
                                loadingShareId === files[0]?.id
                              }
                              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 transition-colors cursor-pointer disabled:opacity-50"
                            >
                              {loadingPreviewId === files[0]?.id ? (
                                <Loader2 className="h-3.5 w-3.5 stroke-[2.5px] animate-spin" />
                              ) : (
                                <Eye className="h-3.5 w-3.5 stroke-[2.5px]" />
                              )}
                              View PDF
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleShareDocument(files[0], config.label)
                              }
                              disabled={
                                loadingPreviewId === files[0]?.id ||
                                loadingShareId === files[0]?.id
                              }
                              className="inline-flex items-center gap-1 text-xs font-bold text-ink-muted hover:text-ink transition-colors cursor-pointer disabled:opacity-50 px-1.5 py-0.5 rounded-md hover:bg-inset"
                              title="Share document"
                            >
                              {loadingShareId === files[0]?.id ? (
                                <Loader2 className="h-3.5 w-3.5 stroke-[2.5px] animate-spin" />
                              ) : (
                                <Share2 className="h-3.5 w-3.5 stroke-[2.5px]" />
                              )}
                              <span>Share</span>
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => setDeleteTargetId(files[0]?.id)}
                            disabled={isDeleting}
                            className="inline-flex items-center justify-center h-7 w-7 rounded-lg text-ink-subtle hover:text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer disabled:opacity-50 shrink-0"
                            title="Delete document"
                          >
                            <Trash2 className="h-3.5 w-3.5 stroke-[2px]" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between w-full">
                          {count < 20 ? (
                            <button
                              type="button"
                              disabled={isThisCardUploading}
                              onClick={() => handleCardClick(config)}
                              className="inline-flex items-center gap-1.5 text-xs font-bold text-accent hover:text-accent-hover transition-colors cursor-pointer disabled:opacity-50"
                            >
                              {isThisCardUploading ? (
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
                              Max 20 images reached
                            </span>
                          )}

                          <span className="text-[10px] font-mono text-ink-subtle">
                            {count} file{count > 1 ? "s" : ""}
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={isThisCardUploading}
                      onClick={() => handleCardClick(config)}
                      style={buttonCustomStyle}
                      className={`inline-flex w-full items-center justify-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50 ${buttonClass}`}
                    >
                      {isThisCardUploading ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin text-white stroke-[2.5px]" />
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <UploadCloud
                            className={`h-3.5 w-3.5 stroke-[2px] ${
                              !isUploaded && isIntakePage
                                ? "text-white"
                                : "text-ink-subtle"
                            }`}
                          />
                          <span>Upload File</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Wizard Step Progression Button */}
        {isWizardMode && (
          <div className="flex justify-end pt-4 border-t border-line/60">
            <div className="flex flex-col sm:flex-row-reverse items-center gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                disabled={!canProceed}
                onClick={() => router.push(`/owner/cars/${carId}/photos`)}
                className="w-full sm:w-auto min-w-45 inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-bold text-inverse transition-all hover:bg-accent-hover active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              >
                Next: Car Photos
                <ArrowRight className="h-4 w-4 stroke-[2.5px]" />
              </button>
              <button
                type="button"
                onClick={() => router.push("/owner/inventory")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl border border-line bg-inset px-4 py-3 text-xs font-bold text-ink-muted hover:text-ink hover:bg-card transition-all cursor-pointer"
              >
                Leave for Now
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Full Screen Document / PDF Modal */}
      {previewItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-3 sm:p-6"
          onClick={() => setPreviewItem(null)}
        >
          <div
            className="relative flex flex-col max-h-[92vh] max-w-5xl w-full rounded-xl bg-card shadow-2xl overflow-hidden border border-line"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-line px-5 py-3.5 bg-card z-10">
              <div className="flex items-center gap-2 min-w-0">
                <h3 className="text-sm font-bold tracking-tight text-ink font-sans truncate">
                  {previewItem.name || "Document Preview"}
                </h3>
                {previewItem.mimeType === "application/pdf" && (
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-rose-500/10 text-rose-700 border border-rose-500/20 px-2 py-0.5 rounded-md shrink-0">
                    PDF Document
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {(() => {
                  const vehiclePrefix = car
                    ? `${
                        car.reg_number
                          ? car.reg_number
                          : `${car.make}_${car.model}`
                      }`
                    : "Vehicle";
                  const ext =
                    previewItem.mimeType === "application/pdf"
                      ? ".pdf"
                      : ".jpg";
                  const docFilename = `${vehiclePrefix}_${
                    previewItem.name || "Document"
                  }${ext}`;

                  return (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          downloadFile({
                            fetchBlob: previewItem.id
                              ? () => documentsApi.downloadFileBlob(carId, previewItem.id!)
                              : undefined,
                            url: previewItem.id ? undefined : previewItem.url,
                            fileName: docFilename,
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
                            fetchBlob: previewItem.id
                              ? () => documentsApi.downloadFileBlob(carId, previewItem.id!)
                              : undefined,
                            url: previewItem.id ? undefined : previewItem.url,
                            fileName: docFilename,
                            title: `${
                              car ? `${car.make} ${car.model}` : "Vehicle"
                            } - ${previewItem.name || "Document"}`,
                            text: car?.reg_number
                              ? `Registration: ${car.reg_number}`
                              : undefined,
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
                  title="PDF Document Preview"
                  className="w-full h-[75vh] min-h-[480px] rounded-lg border border-line bg-card shadow-xs"
                />
              ) : (
                <AuthenticatedImage
                  src={previewItem.url}
                  alt="Document Preview"
                  className="max-h-[75vh] w-auto max-w-full rounded-lg shadow-sm object-contain"
                />
              )}
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Delete Document File"
        description="Are you sure you want to delete this document file? If this is the last file for this document type, it will be marked as missing."
        confirmText="Delete File"
        cancelText="Cancel"
        variant="danger"
        icon={<Trash2 className="h-5.5 w-5.5 stroke-[2.25px]" />}
      />
    </>
  );
}
