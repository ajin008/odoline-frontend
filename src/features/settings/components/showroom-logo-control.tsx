"use client";

import { useState, useRef, useEffect } from "react";
import { useConfig } from "../hooks/use-config";
import { useUploadLogo } from "../hooks/use-upload-logo";
import { Upload, Loader2, Check, X, Building2, Camera } from "lucide-react";
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
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-subtle block">
          Showroom Brand Logo
        </label>
        {selectedFile && !isPending && (
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
            Unsaved Changes
          </span>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-xl border border-line/50 bg-inset/50 p-4">
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={handleFileSelect}
        />

        {/* Logo Preview Container with sleek dark/light backdrop & hover overlay */}
        <div
          onClick={() =>
            !isPending && !isConfigLoading && fileInputRef.current?.click()
          }
          className="group relative flex h-24 w-36 sm:h-28 sm:w-44 shrink-0 items-center justify-center rounded-xl border border-line/80 bg-surface overflow-hidden shadow-xs transition-all cursor-pointer hover:border-accent/60"
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
              className="h-full w-full object-contain p-2.5"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-3 text-center text-ink-subtle space-y-1">
              <Building2 className="h-7 w-7 stroke-[1.5px] text-ink-subtle/50" />
              <span className="text-[10px] font-medium text-ink-muted">
                Click to upload logo
              </span>
            </div>
          )}

          {/* Interactive Hover Overlay */}
          {!isPending && (
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white space-y-1">
              <Camera className="h-5 w-5 stroke-[2px]" />
              <span className="text-[10px] font-bold tracking-tight">
                {displayUrl ? "Change Logo" : "Upload Logo"}
              </span>
            </div>
          )}

          {/* Pending Spinner Overlay */}
          {isPending && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex flex-col items-center justify-center text-white z-10 space-y-1">
              <Loader2 className="h-6 w-6 animate-spin text-white" />
              <span className="text-[10px] font-bold tracking-tight">
                Uploading...
              </span>
            </div>
          )}
        </div>

        {/* Actions & Instructions Block */}
        <div className="space-y-2.5 flex-1 min-w-0">
          {selectedFile ? (
            /* Unsaved Draft Actions */
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isPending}
                  className="h-9 px-4 rounded-xl bg-accent text-inverse hover:bg-accent-hover font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 shadow-xs"
                >
                  {isPending ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Check className="h-3.5 w-3.5 stroke-[2.5px]" />
                  )}
                  <span>Save New Logo</span>
                </button>

                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isPending}
                  className="h-9 px-3.5 rounded-xl border border-line/60 bg-surface hover:bg-card text-ink font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                >
                  <X className="h-3.5 w-3.5 text-ink-subtle" />
                  <span>Cancel</span>
                </button>
              </div>

              <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium leading-normal">
                Draft logo selected:{" "}
                <strong className="font-semibold">{selectedFile.name}</strong> (
                {(selectedFile.size / 1024).toFixed(0)} KB). Click{" "}
                <strong>Save New Logo</strong> to publish.
              </p>
            </div>
          ) : (
            /* Default Actions */
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isConfigLoading || isPending}
                  className="h-9 px-4 rounded-xl border border-line/60 bg-surface hover:bg-card text-ink font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 shadow-2xs"
                >
                  <Upload className="h-3.5 w-3.5 text-accent stroke-[2.25px]" />
                  <span>
                    {config?.showroom_logo_url
                      ? "Change Brand Logo"
                      : "Upload Brand Logo"}
                  </span>
                </button>
              </div>

              <p className="text-[11px] text-ink-muted leading-relaxed">
                PNG, JPEG or WebP logo with transparent or light backdrop (max
                10MB). Used on printed PDF receipts, sales agreements, and
                official documents.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
