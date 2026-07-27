import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { documentsApi, UploadDocumentPayload } from "../api/documents-api";
import { getApiErrorMessage } from "@/src/utils/error-handler";
import { queryKeys } from "@/src/lib/query-keys";

export function useCarDocuments(
  carId: string,
  options?: { enabled?: boolean }
) {
  return useQuery({
    // Standardizing the query key structure
    queryKey: ["cars", carId, "documents"],
    queryFn: () => documentsApi.getList(carId),
    enabled: !!carId && (options?.enabled ?? true),
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
      queryClient.invalidateQueries({ queryKey: queryKeys.cars.detail(carId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.cars.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats });
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
      queryClient.invalidateQueries({ queryKey: queryKeys.cars.detail(carId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.cars.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

/** Cached presigned URL lookup with 10-minute staleTime to prevent 429 rate limits */
export function usePresignedUrl(
  carId: string,
  documentId?: string | null,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: ["cars", carId, "documents", documentId, "presigned-url"],
    queryFn: () => documentsApi.getPresignedUrl(carId, documentId!),
    enabled: !!carId && !!documentId && (options?.enabled ?? true),
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
    gcTime: 15 * 60 * 1000,
    retry: 1,
  });
}
