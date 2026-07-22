import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { documentsApi, UploadDocumentPayload } from "../api/documents-api";
import { getApiErrorMessage } from "@/src/utils/error-handler";

export function useCarDocuments(carId: string) {
  return useQuery({
    // Standardizing the query key structure
    queryKey: ["cars", carId, "documents"],
    queryFn: () => documentsApi.getList(carId),
    enabled: !!carId,
  });
}

export function useUploadDocument(carId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UploadDocumentPayload) =>
      documentsApi.upload(payload),
    onSuccess: () => {
      toast.success("Document uploaded successfully");
      queryClient.invalidateQueries({ queryKey: ["cars", carId, "documents"] });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useDeleteDocument(carId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (documentId: string) => documentsApi.delete(carId, documentId),
    onSuccess: () => {
      toast.success("Document removed");
      queryClient.invalidateQueries({ queryKey: ["cars", carId, "documents"] });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}
