"use client";

import { useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
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
} from "lucide-react";
import {
  DOCUMENT_CONFIGS,
  DocumentType,
  DocumentConfigItem,
} from "../type/document-types";
import { useCarDocuments } from "../hooks/use-documents";
import { useDocumentActions } from "../hooks/use-document-actions";

interface DocumentsGridProps {
  carId: string;
  isWizardMode?: boolean;
}

function DocumentsGridSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-16 w-full animate-pulse rounded-2xl bg-inset border border-line" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="flex h-36 flex-col justify-between rounded-2xl border border-line bg-card p-4"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 animate-pulse rounded-xl bg-inset" />
                <div className="space-y-1">
                  <div className="h-3 w-20 animate-pulse rounded-md bg-inset" />
                  <div className="h-2 w-12 animate-pulse rounded-md bg-inset" />
                </div>
              </div>
              <div className="h-2 w-3/4 animate-pulse rounded-md bg-inset" />
            </div>
            <div className="border-t border-line/50 pt-2.5">
              <div className="h-8 w-full animate-pulse rounded-xl bg-inset" />
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

  const { data: documents = [], isLoading } = useCarDocuments(carId);

  const {
    uploadAndCompress,
    fetchDocumentUrl,
    deleteDocument,
    isUploading,
    isDeleting,
  } = useDocumentActions(carId);

  const [selectedDocType, setSelectedDocType] = useState<DocumentType | null>(
    null
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loadingPreviewId, setLoadingPreviewId] = useState<string | null>(null);

  const handleCardClick = (config: DocumentConfigItem) => {
    setSelectedDocType(config.type);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedDocType) {
      uploadAndCompress(file, selectedDocType);
    }
  };

  const handleViewPreview = async (documentId: string) => {
    setLoadingPreviewId(documentId);
    const url = await fetchDocumentUrl(documentId);
    if (url) {
      setPreviewUrl(url);
    }
    setLoadingPreviewId(null);
  };

  if (isLoading) {
    return <DocumentsGridSkeleton />;
  }

  const uploadedTypes = new Set(documents.map((d) => d.document_type));
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
          accept="image/jpeg, image/png, image/webp"
          className="hidden"
        />

        {/* Clean Header Status Banner without outer borders */}
        <div className="flex items-start justify-between gap-4 rounded-2xl p-5 transition-all bg-card">
          <div className="flex items-start gap-3.5">
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-white mt-0.5 ${
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

          {/* Borderless Minimal Status Pill Badge */}
          <span
            className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider shrink-0 ${
              canProceed
                ? "bg-emerald-500/10 text-emerald-700"
                : "bg-amber-500/10 text-amber-800"
            }`}
          >
            {canProceed ? "Ready to Progress" : "Action Required"}
          </span>
        </div>

        {/* Grid Matrix */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DOCUMENT_CONFIGS.map((config) => {
            const uploadedDoc = documents.find(
              (d) => d.document_type === config.type
            );
            const isThisCardUploading =
              isUploading && selectedDocType === config.type;

            let cardContainerStyle =
              "border-line bg-card hover:border-line-focus";
            let iconBoxStyle = "bg-inset text-ink-subtle border border-line";

            if (uploadedDoc) {
              cardContainerStyle =
                "border-emerald-500/40 bg-emerald-500/[0.03]";
              iconBoxStyle = "bg-emerald-600 text-white";
            }

            let buttonClass = "border-line bg-card text-ink hover:bg-inset";
            let buttonCustomStyle: React.CSSProperties = {};

            if (!uploadedDoc && isIntakePage) {
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
                className={`flex flex-col justify-between rounded-2xl border p-4.5 transition-all ${cardContainerStyle}`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-colors ${iconBoxStyle}`}
                      >
                        {uploadedDoc ? (
                          <Check className="h-4 w-4 stroke-[3px]" />
                        ) : (
                          <FileText className="h-4 w-4 stroke-[2px]" />
                        )}
                      </span>

                      <div className="min-w-0">
                        <h3 className="text-xs font-bold text-ink font-sans truncate">
                          {config.label}
                        </h3>

                        {uploadedDoc ? (
                          <span className="inline-block mt-0.5 text-[10px] font-bold tracking-tight text-emerald-700">
                            ✓ Uploaded
                          </span>
                        ) : (
                          <span
                            className={`inline-block mt-0.5 text-[9px] font-mono font-bold uppercase tracking-wider ${
                              isIntakePage && config.isHardDoc
                                ? "text-rose-600 font-extrabold"
                                : "text-ink-subtle"
                            }`}
                          >
                            {config.isHardDoc ? "Required" : "Optional"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] font-medium text-ink-muted leading-relaxed line-clamp-2">
                    {config.description}
                  </p>
                </div>

                {/* Card Action Controls */}
                <div className="mt-4 border-t border-line/60 pt-3">
                  {uploadedDoc ? (
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => handleViewPreview(uploadedDoc.id)}
                        disabled={loadingPreviewId === uploadedDoc.id}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {loadingPreviewId === uploadedDoc.id ? (
                          <Loader2 className="h-3.5 w-3.5 stroke-[2.5px] animate-spin" />
                        ) : (
                          <Eye className="h-3.5 w-3.5 stroke-[2.5px]" />
                        )}
                        View Document
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteDocument(uploadedDoc.id)}
                        disabled={isDeleting}
                        className="inline-flex items-center justify-center h-7 w-7 rounded-lg text-ink-subtle hover:text-danger hover:bg-danger-light transition-colors cursor-pointer disabled:opacity-50"
                        title="Delete document"
                      >
                        <Trash2 className="h-3.5 w-3.5 stroke-[2px]" />
                      </button>
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
                              !uploadedDoc && isIntakePage
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
                onClick={() =>
                  router.push(`/owner/cars/${carId}/refurbishment`)
                }
                className="w-full sm:w-auto min-w-45 inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-bold text-inverse transition-all hover:bg-accent-hover active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              >
                Next: Refurbishment
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

      {/* Full Screen Image Modal */}
      {previewUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 sm:p-6"
          onClick={() => setPreviewUrl(null)}
        >
          <div
            className="relative flex flex-col max-h-full max-w-4xl w-full rounded-2xl bg-card shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-line p-4 bg-card z-10">
              <h3 className="text-sm font-bold tracking-tight text-ink">
                Document Preview
              </h3>
              <button
                type="button"
                onClick={() => setPreviewUrl(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-subtle hover:bg-inset hover:text-ink transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Image Body */}
            <div className="flex-1 overflow-auto bg-inset p-4 flex items-center justify-center min-h-75">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="Document Preview"
                className="max-h-[75vh] w-auto max-w-full rounded-lg shadow-sm object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
