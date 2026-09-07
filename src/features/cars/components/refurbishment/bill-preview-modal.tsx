// src/features/cars/components/refurbishment/bill-preview-modal.tsx
"use client";

import { X, Download, Share2 } from "lucide-react";
import { downloadFile, shareFile } from "@/src/lib/file-action-utils";

interface BillPreviewModalProps {
  billPreviewUrl: string | null;
  onClose: () => void;
}

export function BillPreviewModal({
  billPreviewUrl,
  onClose,
}: BillPreviewModalProps) {
  if (!billPreviewUrl) return null;

  const billFilename = "refurbishment-bill.jpg";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 sm:p-6 select-none font-sans"
      onClick={onClose}
    >
      <div
        className="relative flex flex-col max-h-full max-w-4xl w-full rounded-2xl bg-card border border-line overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-line p-4 bg-card z-10">
          <h3 className="text-sm font-bold tracking-tight text-ink">
            Vendor Bill Preview
          </h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => downloadFile({ url: billPreviewUrl, fileName: billFilename })}
              className="inline-flex items-center gap-1.5 rounded-lg bg-inset border border-line px-3 py-1.5 text-xs font-bold text-ink-muted hover:text-ink hover:bg-line/40 transition-colors cursor-pointer"
              title="Download Bill"
            >
              <Download className="h-3.5 w-3.5 stroke-[2px]" />
              <span className="hidden sm:inline">Download</span>
            </button>

            <button
              type="button"
              onClick={() =>
                shareFile({
                  url: billPreviewUrl,
                  fileName: billFilename,
                  title: "Vendor Refurbishment Bill",
                  mimeType: "image/jpeg",
                })
              }
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-500/10 hover:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-500/20 transition-all px-3 py-1.5 rounded-lg cursor-pointer"
              title="Share Bill"
            >
              <Share2 className="h-3.5 w-3.5 stroke-[2px]" />
              <span className="hidden sm:inline">Share</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-subtle hover:bg-inset hover:text-ink transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Image Body */}
        <div className="flex-1 overflow-auto bg-inset p-4 flex items-center justify-center min-h-75">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={billPreviewUrl}
            alt="Bill Preview"
            className="max-h-[75vh] w-auto max-w-full rounded-lg object-contain"
          />
        </div>
      </div>
    </div>
  );
}
