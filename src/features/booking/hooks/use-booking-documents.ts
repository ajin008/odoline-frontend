import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { bookingApi } from "../api/booking-api";

export function useBookingDocuments(bookingId: string) {
  return useQuery({
    queryKey: ["booking-documents", bookingId],
    queryFn: () => bookingApi.getDocuments(bookingId),
    enabled: Boolean(bookingId),
  });
}

export function useBookingDocumentActions(bookingId: string) {
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async ({
      files,
      docType,
    }: {
      files: File[];
      docType: string;
    }) => {
      const formData = new FormData();
      formData.append("doc_type", docType);
      for (const file of files) {
        formData.append("files", file);
      }
      return await bookingApi.uploadDocuments(bookingId, formData);
    },
    onSuccess: () => {
      toast.success("Document uploaded successfully");
      queryClient.invalidateQueries({
        queryKey: ["booking-documents", bookingId],
      });
      queryClient.invalidateQueries({
        queryKey: ["booking", bookingId],
      });
    },
    onError: (err: unknown) => {
      let msg = "Upload failed";
      if (isAxiosError(err)) {
        msg = err.response?.data?.message || err.message || msg;
      } else if (err instanceof Error) {
        msg = err.message;
      }
      toast.error(msg);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (docId: string) => {
      await bookingApi.deleteDocument(bookingId, docId);
    },
    onSuccess: () => {
      toast.success("Document deleted");
      queryClient.invalidateQueries({
        queryKey: ["booking-documents", bookingId],
      });
      queryClient.invalidateQueries({
        queryKey: ["booking", bookingId],
      });
    },
    onError: (err: unknown) => {
      let msg = "Delete failed";
      if (isAxiosError(err)) {
        msg = err.response?.data?.message || err.message || msg;
      } else if (err instanceof Error) {
        msg = err.message;
      }
      toast.error(msg);
    },
  });

  return {
    uploadDocuments: uploadMutation.mutateAsync,
    deleteDocument: deleteMutation.mutateAsync,
    isUploading: uploadMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
