// src/features/cars/utils/share-car-document.ts
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
    fetchBlob: () => documentsApi.downloadFileBlob(carId, documentId),
    fileName,
    title: shareTitle,
    text: shareText,
    mimeType,
  });
}
