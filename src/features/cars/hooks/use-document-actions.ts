import { toast } from "sonner";
import imageCompression from "browser-image-compression";
import { useUploadDocument, useDeleteDocument } from "./use-documents";
import { documentsApi } from "../api/documents-api";
import type { DocumentType } from "../type/document-types";

export function useDocumentActions(carId: string) {
  const uploadMutation = useUploadDocument(carId);
  const deleteMutation = useDeleteDocument(carId);

  const uploadAndCompress = async (file: File, documentType: DocumentType) => {
    const loadingToastId = toast.loading("Compressing and uploading...");

    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        initialQuality: 0.8,
      };

      const compressedFile = await imageCompression(file, options);

      uploadMutation.mutate(
        { carId, documentType, file: compressedFile },
        { onSettled: () => toast.dismiss(loadingToastId) }
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("[Image Compression Error]:", error);
      toast.dismiss(loadingToastId);
      toast.error("Failed to process the image. Please try another file.");
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
