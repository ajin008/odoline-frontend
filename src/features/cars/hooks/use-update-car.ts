// features/cars/hooks/use-update-car.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { carsApi } from "../api/cars-api";
import { queryKeys } from "@/src/lib/query-keys";
import { getApiErrorMessage } from "@/src/utils/error-handler";
import type { CreateCarFormValues } from "../schemas/create-car-schema";

/**
 * Updates a car (edit mode). Takes the car id up front.
 * On success:
 *   - invalidates this car's detail cache (so the header/form refresh)
 *   - invalidates the cars list + dashboard (a field may affect them)
 *   - shows a success toast (no redirect — you stay on the edit tab)
 */
export function useUpdateCar(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCarFormValues) => carsApi.update(id, data),

    onSuccess: () => {
      // This specific car's cached data is now stale → refetch it.
      queryClient.invalidateQueries({ queryKey: queryKeys.cars.detail(id) });
      // The list may show changed fields (make/model/reg) → refresh it too.
      queryClient.invalidateQueries({ queryKey: queryKeys.cars.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats });

      toast.success("Changes saved");
    },

    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}
