import { toast } from "sonner";
import imageCompression from "browser-image-compression";
import { useUploadDocument, useDeleteDocument } from "./use-documents";
import { documentsApi } from "../api/documents-api";
import type { DocumentType } from "../type/document-types";

export function useDocumentActions(carId: string) {
  const uploadMutation = useUploadDocument(carId);
  const deleteMutation = useDeleteDocument(carId);

  const uploadAndCompressFiles = async (
    files: File[],
    documentType: DocumentType
  ) => {
    if (!files || files.length === 0) return;

    const hasImages = files.some((f) => f.type.startsWith("image/"));
    const loadingToastId = toast.loading(
      hasImages
        ? `Compressing and uploading ${files.length} file${files.length > 1 ? "s" : ""}...`
        : `Uploading document...`
    );

    try {
      const processedFiles = await Promise.all(
        files.map(async (file) => {
          if (file.type.startsWith("image/")) {
            try {
              const options = {
                maxSizeMB: 1,
                maxWidthOrHeight: 1920,
                useWebWorker: true,
                initialQuality: 0.8,
              };
              return await imageCompression(file, options);
            } catch {
              return file;
            }
          }
          return file;
        })
      );

      uploadMutation.mutate(
        { carId, documentType, files: processedFiles },
        { onSettled: () => toast.dismiss(loadingToastId) }
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("[Document Upload Error]:", error);
      toast.dismiss(loadingToastId);
      toast.error("Failed to process documents. Please try another file.");
    }
  };

  const uploadAndCompress = async (file: File, documentType: DocumentType) => {
    await uploadAndCompressFiles([file], documentType);
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
    uploadAndCompressFiles,
    fetchDocumentUrl,
    deleteDocument,
    isUploading: uploadMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
