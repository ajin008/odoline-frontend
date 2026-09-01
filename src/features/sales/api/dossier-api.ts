import { apiClient } from "@/src/lib/api-client";
import { endpoints } from "@/src/lib/endpoints";
import type { CarDossier } from "../types/dossier-types";

export const dossierApi = {
  /** GET /api/v1/cars/:id/dossier — Fetch complete owner vehicle dossier */
  async getCarDossier(carId: string): Promise<CarDossier> {
    const res = await apiClient.get(endpoints.cars.dossier(carId));
    return res.data.data;
  },
};
