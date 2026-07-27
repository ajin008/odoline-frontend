// src/features/cars/hooks/use-refurbishment.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  refurbishmentApi,
  CreateRefurbItemPayload,
  //   RefurbishmentItem,
} from "../api/refurbishment-api";
import { queryKeys } from "@/src/lib/query-keys";
import { toast } from "sonner";

export function useRefurbishmentItems(carId: string) {
  return useQuery({
    queryKey: queryKeys.cars.refurbItems(carId),
    queryFn: () => refurbishmentApi.getList(carId),
    enabled: !!carId,
  });
}

export function useAddRefurbItem(carId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRefurbItemPayload) =>
      refurbishmentApi.create(carId, data),
    onSuccess: () => {
      toast.success("Workshop task added successfully");
      // Invalidate refurb items, car detail, car lists across all status tabs, and dashboard counts
      queryClient.invalidateQueries({
        queryKey: queryKeys.cars.refurbItems(carId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.cars.detail(carId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.cars.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats });
    },
    onError: () => {
      toast.error("Failed to add workshop task");
    },
  });
}

export function useUpdateRefurbItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      itemId,
      data,
    }: {
      itemId: string;
      data: Partial<CreateRefurbItemPayload>;
    }) => refurbishmentApi.update(itemId, data),
    // Accept carId optionally or extract it safely from query cache if needed,
    // but invalidate broadly across refurb items cache safely:
    onSuccess: (updatedItem) => {
      toast.success("Task updated");
      queryClient.invalidateQueries({
        queryKey: queryKeys.cars.refurbItems(updatedItem.car_id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.cars.detail(updatedItem.car_id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.cars.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats });
    },
    onError: () => {
      toast.error("Failed to update task");
    },
  });
}

export function useDeleteRefurbItem(carId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => refurbishmentApi.remove(itemId),
    onSuccess: () => {
      toast.success("Task removed");
      queryClient.invalidateQueries({
        queryKey: queryKeys.cars.refurbItems(carId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.cars.detail(carId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.cars.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats });
    },
    onError: () => {
      toast.error("Failed to remove task");
    },
  });
}

export function useViewRefurbBill() {
  return useMutation({
    mutationFn: async (itemId: string) => {
      const url = await refurbishmentApi.getBillUrl(itemId);
      return url;
    },
    onSuccess: (url) => {
      window.open(url, "_blank");
    },
    onError: () => {
      toast.error("Failed to generate secure bill link");
    },
  });
}
