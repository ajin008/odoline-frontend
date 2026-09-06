// features/cars/hooks/use-infinite-cars.ts
import { useInfiniteQuery } from "@tanstack/react-query";
import { carsApi } from "../api/cars-api";
import { queryKeys } from "@/src/lib/query-keys";

const PAGE_SIZE = 16;

/**
 * Cursor-paginated cars list, as infinite-scroll server state.
 *
 * Reusable across every inventory sub-tab — statuses/sort/search/filters fully
 * describe one distinct scroll. Changing any of them changes the query key,
 * so TanStack Query starts a fresh page-1 fetch instead of continuing the
 * old scroll's cursor chain.
 */
export function useInfiniteCars({
  statuses,
  sort,
  search,
  fuel_type,
  min_price,
  max_price,
}: {
  statuses?: readonly string[] | string[];
  sort?: string;
  search?: string;
  fuel_type?: string;
  min_price?: number;
  max_price?: number;
}) {
  return useInfiniteQuery({
    queryKey: queryKeys.cars.infinite({
      statuses,
      sort,
      search,
      fuel_type,
      min_price,
      max_price,
    }),
    queryFn: ({ pageParam }) =>
      carsApi.getList({
        statuses: statuses ? [...statuses] : undefined,
        sort,
        search,
        fuel_type,
        min_price,
        max_price,
        cursor: pageParam,
        limit: PAGE_SIZE,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.pagination.next_cursor ?? undefined,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

/**
 * Cursor-paginated staff inventory list (filtered by availability).
 */
export function useInfiniteStaffStock({
  availability = "in_stock",
  sort,
  search,
  fuel_type,
  min_price,
  max_price,
}: {
  availability?: "in_stock" | "booked";
  sort?: string;
  search?: string;
  fuel_type?: string;
  min_price?: number;
  max_price?: number;
} = {}) {
  return useInfiniteQuery({
    queryKey: [
      "cars",
      "staff-stock",
      { availability, sort, search, fuel_type, min_price, max_price },
    ],
    queryFn: ({ pageParam }) =>
      carsApi.getStaffStock({
        availability,
        sort,
        search,
        fuel_type,
        min_price,
        max_price,
        cursor: pageParam,
        limit: PAGE_SIZE,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.pagination.next_cursor ?? undefined,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
