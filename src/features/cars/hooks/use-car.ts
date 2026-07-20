// features/cars/hooks/use-car.ts
import { useQuery } from "@tanstack/react-query";
import { carsApi } from "../api/cars-api";
import { queryKeys } from "@/src/lib/query-keys";

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
