import { useQuery } from "@tanstack/react-query";
import { departmentApi } from "../api/department-api";
import { queryKeys } from "@/src/lib/query-keys";

export function useDepartments(statusFilter: "active" | "inactive" | "all" = "active") {
  return useQuery({
    queryKey: queryKeys.departments.list(statusFilter),
    queryFn: () => departmentApi.getList(statusFilter),
    staleTime: 2 * 60 * 1000,
  });
}
