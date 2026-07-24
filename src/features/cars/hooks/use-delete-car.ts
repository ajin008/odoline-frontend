// features/cars/hooks/use-delete-car.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { carsApi } from "../api/cars-api";
import { queryKeys } from "@/src/lib/query-keys";
import { getApiErrorMessage } from "@/src/utils/error-handler";

export function useDeleteCar() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => carsApi.remove(id),
    onSuccess: () => {
      toast.success("Car removed");
      queryClient.invalidateQueries({ queryKey: queryKeys.cars.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats });
      router.push("/owner/inventory");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}
