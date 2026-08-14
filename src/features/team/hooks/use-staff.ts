import { useQuery } from "@tanstack/react-query";
import { staffApi } from "../api/staff-api";
import { queryKeys } from "@/src/lib/query-keys";

export function useStaff(statusFilter: "active" | "inactive" | "all" = "active") {
  return useQuery({
    queryKey: queryKeys.staff.list(statusFilter),
    queryFn: () => staffApi.getList(statusFilter),
    staleTime: 2 * 60 * 1000,
  });
}

export function useMyProfile() {
  return useQuery({
    queryKey: queryKeys.staff.me,
    queryFn: () => staffApi.getMe(),
    staleTime: 60 * 1000,
  });
}
