// features/cars/hooks/use-cars.ts
import { useQuery } from "@tanstack/react-query";
import { carsApi } from "../api/cars-api";
import { queryKeys } from "@/src/lib/query-keys";

/**
 * The cars list, filtered by status. Server state via useQuery.
 * The statuses are part of the query key, so each filter is cached separately.
 */
export function useCars(statuses?: string[]) {
  return useQuery({
    // key includes the filter → different filters = different cache entries
    queryKey: [...queryKeys.cars.all, { statuses }],
    queryFn: () => carsApi.getList(statuses),
  });
}
