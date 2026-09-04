import { useQuery } from "@tanstack/react-query";
import { staffApi } from "../api/staff-api";
import { queryKeys } from "@/src/lib/query-keys";
import { useMe } from "@/src/features/auth/hooks/use-me";

export function useStaff(statusFilter: "active" | "inactive" | "all" = "active") {
  const { data: user } = useMe();
  const isAllowed = user?.role === "owner" || user?.role === "cro";

  return useQuery({
    queryKey: queryKeys.staff.list(statusFilter),
    queryFn: () => staffApi.getList(statusFilter),
    staleTime: 2 * 60 * 1000,
    enabled: isAllowed,
  });
}

export function useMyProfile() {
  return useQuery({
    queryKey: queryKeys.staff.me,
    queryFn: () => staffApi.getMe(),
    staleTime: 60 * 1000,
  });
}
