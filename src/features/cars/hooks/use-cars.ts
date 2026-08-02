// features/cars/hooks/use-cars.ts
import { useQuery } from "@tanstack/react-query";
import { carsApi } from "../api/cars-api";
import { queryKeys } from "@/src/lib/query-keys";

/**
 * The cars list, filtered by status and/or search. Server state via useQuery.
 * The statuses/sort/search are part of the query key, so each combination is
 * cached separately.
 */
export function useCars(statuses?: string[], sort?: string, search?: string) {
  return useQuery({
    // key includes filter/sort/search → different combos = different cache entries
    queryKey: [...queryKeys.cars.all, { statuses, sort, search }],
    queryFn: () => carsApi.getList(statuses, sort, search),
  });
}
