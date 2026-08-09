import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { carPhotosApi } from "../api/car-photos-api";
import { queryKeys } from "@/src/lib/query-keys";
import { toast } from "sonner";

export function useCarPhotos(carId: string) {
  return useQuery({
    queryKey: queryKeys.cars.photos(carId),
    queryFn: () => carPhotosApi.getPhotos(carId),
    enabled: Boolean(carId),
    staleTime: 30000,
  });
}

export function useUploadCarPhoto(carId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => carPhotosApi.uploadPhoto(carId, file),
    onSuccess: () => {
      toast.success("Photo uploaded successfully");
      queryClient.invalidateQueries({ queryKey: queryKeys.cars.photos(carId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.cars.detail(carId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.cars.all });
    },
    onError: () => {
      toast.error("Failed to upload photo");
    },
  });
}

export function useDeleteCarPhoto(carId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (photoId: string) => carPhotosApi.deletePhoto(carId, photoId),
    onSuccess: () => {
      toast.success("Photo deleted");
      queryClient.invalidateQueries({ queryKey: queryKeys.cars.photos(carId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.cars.detail(carId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.cars.all });
    },
    onError: () => {
      toast.error("Failed to delete photo");
    },
  });
}

export function useSetPrimaryCarPhoto(carId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (photoId: string) => carPhotosApi.setPrimary(carId, photoId),
    onSuccess: () => {
      toast.success("Primary photo updated");
      queryClient.invalidateQueries({ queryKey: queryKeys.cars.photos(carId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.cars.detail(carId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.cars.all });
    },
    onError: () => {
      toast.error("Failed to update primary photo");
    },
  });
}
