import { toast } from "sonner";
import imageCompression from "browser-image-compression";
import { useUploadDocument, useDeleteDocument } from "./use-documents";
import { documentsApi } from "../api/documents-api";
import type { DocumentType } from "../type/document-types";

export function useDocumentActions(carId: string) {
  const uploadMutation = useUploadDocument(carId);
  const deleteMutation = useDeleteDocument(carId);

  const uploadAndCompress = async (file: File, documentType: DocumentType) => {
    const isImage = file.type.startsWith("image/");
    const loadingToastId = toast.loading(
      isImage ? "Compressing and uploading..." : "Uploading document..."
    );

    try {
      let fileToUpload = file;

      if (isImage) {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
          initialQuality: 0.8,
        };
        fileToUpload = await imageCompression(file, options);
      }

      uploadMutation.mutate(
        { carId, documentType, file: fileToUpload },
        { onSettled: () => toast.dismiss(loadingToastId) }
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("[Document Upload Error]:", error);
      toast.dismiss(loadingToastId);
      toast.error("Failed to process the document. Please try another file.");
    }
  };

  // NEW FUNCTION: Returns the URL instead of opening a window
  const fetchDocumentUrl = async (
    documentId: string
  ): Promise<string | null> => {
    try {
      const url = await documentsApi.getPresignedUrl(carId, documentId);
      return url;
    } catch {
      toast.error("Failed to load document preview");
      return null;
    }
  };

  const deleteDocument = (documentId: string) => {
    deleteMutation.mutate(documentId);
  };

  return {
    uploadAndCompress,
    fetchDocumentUrl,
    deleteDocument,
    isUploading: uploadMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
