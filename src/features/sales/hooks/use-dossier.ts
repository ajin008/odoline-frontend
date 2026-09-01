import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/src/lib/query-keys";
import { dossierApi } from "../api/dossier-api";
import type { CarDossier } from "../types/dossier-types";

export function useDossier(carId: string) {
  return useQuery<CarDossier>({
    queryKey: queryKeys.cars.dossier(carId),
    queryFn: () => dossierApi.getCarDossier(carId),
    enabled: Boolean(carId),
    staleTime: 5 * 60 * 1000,
  });
}
