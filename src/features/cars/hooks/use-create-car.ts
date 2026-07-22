// features/cars/hooks/use-create-car.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { carsApi } from "../api/cars-api";
import { queryKeys } from "@/src/lib/query-keys";
import { getApiErrorMessage } from "@/src/utils/error-handler";

/**
 * Creates a car (Step 1). On success:
 *   - invalidates the cars list + dashboard stats (their data changed)
 *   - navigates to the intake continuation using the new car's id
 * On failure: shows an error toast.
 */
export function useCreateCar() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: carsApi.create,

    onSuccess: (car) => {
      // The cars list and dashboard counts are now stale — mark them to refetch.
      queryClient.invalidateQueries({ queryKey: queryKeys.cars.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats });

      // Continue to Steps 2 & 3 for this car (id now lives in the URL).
      router.push(`/owner/cars/${car.id}/documents`);
    },

    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}
