// features/cars/hooks/use-car.ts
import { useQuery } from "@tanstack/react-query";
import { carsApi } from "../api/cars-api";
import { queryKeys } from "@/src/lib/query-keys";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

/**
 * A single car by id. Cached under ["cars", id] — the detail key.
 * `enabled: !!id` prevents the query firing before an id is available.
 */
export function useCar(id: string) {
  return useQuery({
    queryKey: queryKeys.cars.detail(id),
    queryFn: () => carsApi.getById(id),
    enabled: !!id,
  });
}

export function useUpdateCarMargin(carId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (margin: string) => carsApi.updateMargin(carId, margin),
    onSuccess: () => {
      toast.success("Margin updated & selling price recalculated");
      queryClient.invalidateQueries({ queryKey: queryKeys.cars.detail(carId) });
    },
    onError: () => {
      toast.error("Failed to update margin");
    },
  });
}

import { getApiErrorMessage } from "@/src/utils/error-handler";

export function useAddToCartStock(carId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => carsApi.addToStock(carId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cars.detail(carId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.cars.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}
