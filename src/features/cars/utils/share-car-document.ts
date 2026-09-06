// src/features/cars/utils/share-car-document.ts
import { toast } from "sonner";
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
  const loadingToastId = toast.loading("Preparing document for sharing...");
  try {
    // 1. Fetch document binary blob via backend API proxy (bypasses CORS)
    let blob: Blob;
    try {
      blob = await documentsApi.downloadFileBlob(carId, documentId);
    } catch {
      // Fallback: try presigned download URL
      const presignedUrl = await documentsApi.getPresignedUrl(carId, documentId);
      const res = await fetch(presignedUrl);
      if (!res.ok) {
        throw new Error(`Failed to download file (${res.status})`);
      }
      blob = await res.blob();
    }

    toast.dismiss(loadingToastId);

    // 2. Determine file type & extension
    const type = mimeType || blob.type || "application/pdf";
    let ext = ".pdf";
    if (type.includes("jpeg") || type.includes("jpg")) ext = ".jpg";
    else if (type.includes("png")) ext = ".png";
    else if (type.includes("webp")) ext = ".webp";
    else if (originalName && originalName.includes(".")) {
      ext = "." + originalName.split(".").pop();
    }

    const cleanLabel = docLabel.trim().replace(/[^a-zA-Z0-9]/g, "-");
    const cleanReg = regNumber ? regNumber.trim().replace(/[^a-zA-Z0-9]/g, "-") : "";
    const filename = cleanReg ? `${cleanLabel}-${cleanReg}${ext}` : `${cleanLabel}${ext}`;

    const file = new File([blob], filename, { type });

    const shareTitle = `${docLabel}${makeModel ? ` - ${makeModel}` : ""}`;
    const shareText = `Document: ${docLabel}${regNumber ? ` (${regNumber})` : ""}`;

    // 3. Mobile Native Web-Share (shares actual file directly to WhatsApp/Social Apps)
    let canShareFiles = false;
    if (
      typeof navigator !== "undefined" &&
      typeof navigator.canShare === "function" &&
      typeof navigator.share === "function"
    ) {
      try {
        canShareFiles = navigator.canShare({ files: [file] });
      } catch {
        canShareFiles = false;
      }
    }

    if (canShareFiles) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          files: [file],
        });
        return;
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") {
          // User closed/cancelled native share sheet
          return;
        }
      }
    }

    // 4. Desktop / Non-Mobile workflow: Automatically download file to computer
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    toast.success(
      "Document file downloaded to your device — attach in WhatsApp Web.",
      {
        action: {
          label: "Open WhatsApp Web",
          onClick: () => {
            window.open("https://web.whatsapp.com", "_blank");
          },
        },
      }
    );

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 120000);
  } catch (err: unknown) {
    toast.dismiss(loadingToastId);
    const msg = err instanceof Error ? err.message : "Failed to share document";
    toast.error(msg);
  }
}
