"use client";

import { useState, useRef, useEffect } from "react";
import { useConfig } from "../hooks/use-config";
import { useUploadLogo } from "../hooks/use-upload-logo";
import { Upload, Loader2, Check, X, Building2 } from "lucide-react";
import { toast } from "sonner";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function ShowroomLogoControl() {
  const { data: config, isLoading: isConfigLoading } = useConfig();
  const uploadLogoMutation = useUploadLogo();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Clean up Object URL when unmounting or changing preview
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input value so re-selecting same file triggers onChange
    e.target.value = "";

    // Client-side validation checks: check mime type or file extension
    const isImage =
      file.type.startsWith("image/") || /\.(png|jpe?g|webp)$/i.test(file.name);

    if (!isImage) {
      toast.error("Please choose a valid PNG, JPEG, or WebP image");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("Logo image must be smaller than 10MB");
      return;
    }

    // Clean up old preview object URL
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const objectUrl = URL.createObjectURL(file);
    setSelectedFile(file);
    setPreviewUrl(objectUrl);
  };

  const handleCancel = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleSave = () => {
    if (!selectedFile) return;

    uploadLogoMutation.mutate(selectedFile, {
      onSuccess: () => {
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
        }
        setSelectedFile(null);
        setPreviewUrl(null);
      },
    });
  };

  const displayUrl = previewUrl || config?.showroom_logo_url;
  const isPending = uploadLogoMutation.isPending;

  return (
    <div className="space-y-3 font-sans">
      <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-subtle block">
        Showroom Brand Logo
      </label>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={handleFileSelect}
        />

        {/* Logo Preview Container with checkered pattern to preserve & highlight alpha transparency */}
        <div
          className="relative flex h-24 w-28 sm:h-28 sm:w-36 shrink-0 items-center justify-center rounded-xl border border-line/60 overflow-hidden shadow-sm transition-all"
          style={{
            backgroundImage:
              "repeating-conic-gradient(var(--canvas-inset) 0% 25%, var(--canvas-card) 0% 50%)",
            backgroundSize: "16px 16px",
          }}
        >
          {isConfigLoading ? (
            <div className="flex items-center justify-center text-ink-subtle">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : displayUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={displayUrl}
              alt="Showroom Logo"
              className="h-full w-full object-contain p-2"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-2 text-center text-ink-subtle space-y-1">
              <Building2 className="h-7 w-7 stroke-[1.75px] text-ink-subtle/60" />
              <span className="text-[10px] font-medium text-ink-muted">
                No logo uploaded
              </span>
            </div>
          )}

          {/* Pending Spinner Overlay */}
          {isPending && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] flex flex-col items-center justify-center text-white z-10 space-y-1">
              <Loader2 className="h-6 w-6 animate-spin text-white" />
              <span className="text-[10px] font-bold tracking-tight">
                Uploading...
              </span>
            </div>
          )}

          {/* Draft Badge if previewing unsaved file */}
          {selectedFile && !isPending && (
            <span className="absolute top-1.5 right-1.5 text-[9px] font-mono font-bold bg-amber-500 text-white px-1.5 py-0.5 rounded shadow-sm">
              Unsaved
            </span>
          )}
        </div>

        {/* Actions & Instructions Block */}
        <div className="space-y-2 flex-1">
          {selectedFile ? (
            /* Unsaved Draft Actions */
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isPending}
                  className="h-8.5 px-3.5 rounded-xl bg-accent text-inverse hover:bg-accent-hover font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 shadow-sm"
                >
                  {isPending ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Check className="h-3.5 w-3.5 stroke-[2.5px]" />
                  )}
                  <span>Save Logo</span>
                </button>

                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isPending}
                  className="h-8.5 px-3 rounded-xl border border-line/60 bg-surface hover:bg-inset text-ink font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                >
                  <X className="h-3.5 w-3.5" />
                  <span>Cancel</span>
                </button>
              </div>

              <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                Draft image selected: {selectedFile.name} (
                {(selectedFile.size / 1024).toFixed(0)} KB). Click Save to
                apply.
              </p>
            </div>
          ) : (
            /* Default Actions */
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isConfigLoading || isPending}
                className="h-8.5 px-3.5 rounded-xl border border-line/60 bg-surface hover:bg-inset text-ink font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                <Upload className="h-3.5 w-3.5 text-accent stroke-[2.5px]" />
                <span>
                  {config?.showroom_logo_url ? "Change Logo" : "Upload Logo"}
                </span>
              </button>

              <p className="text-[11px] text-ink-muted">
                Official PNG/JPEG/WebP logo. Preserves transparency for PDF
                receipts &amp; documents (max 5MB).
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
