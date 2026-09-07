// src/features/cars/utils/share-car-document.ts
//
// FIX-24: business logic only (choosing the blob source + building a clean
// car/document-specific filename & title). The actual fetch/sanitize/share/
// download mechanics live in the single shared module src/lib/file-actions.ts.
import { shareFile } from "@/src/lib/file-actions";
import { documentsApi } from "../api/documents-api";

export interface ShareCarDocumentParams {
  carId: string;
  documentId: string;
  docLabel: string;
  originalName?: string;
  mimeType?: string;
  regNumber?: string | null;
  makeModel?: string;
}

export async function shareCarDocument({
  carId,
  documentId,
  docLabel,
  originalName,
  mimeType,
  regNumber,
  makeModel,
}: ShareCarDocumentParams): Promise<void> {
  let ext = "";
  if (originalName && originalName.includes(".")) {
    const parts = originalName.split(".");
    const rawExt = parts[parts.length - 1];
    if (rawExt) ext = `.${rawExt}`;
  }

  const cleanReg = regNumber ? regNumber.trim().replace(/[^a-zA-Z0-9]/g, "-") : "";
  const cleanLabel = docLabel.trim().replace(/[^a-zA-Z0-9]/g, "-") || "Document";
  const fileName = cleanReg ? `${cleanReg}-${cleanLabel}${ext}` : `${cleanLabel}${ext}`;

  const shareTitle = `${docLabel}${makeModel ? ` - ${makeModel}` : ""}`;
  const shareText = `Document: ${docLabel}${regNumber ? ` (${regNumber})` : ""}`;

  await shareFile({
    fetchBlob: async () => {
      try {
        return await documentsApi.downloadFileBlob(carId, documentId);
      } catch {
        // Fallback: try presigned download URL if the proxied blob endpoint fails
        const presignedUrl = await documentsApi.getPresignedUrl(carId, documentId);
        const res = await fetch(presignedUrl);
        if (!res.ok) {
          throw new Error(`Failed to download file (${res.status})`);
        }
        return res.blob();
      }
    },
    fileName,
    title: shareTitle,
    text: shareText,
    mimeType,
  });
}
