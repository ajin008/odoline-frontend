import { apiClient } from "@/src/lib/api-client";
import { endpoints } from "@/src/lib/endpoints";

export interface CarPhoto {
  id: string;
  car_id: string;
  file_key: string;
  url: string;
  is_primary: boolean;
  sort_order: number;
  created_at: string;
}

export const carPhotosApi = {
  /** Fetch all gallery photos for a car */
  async getPhotos(carId: string): Promise<CarPhoto[]> {
    const res = await apiClient.get(endpoints.cars.photos(carId));
    return res.data.data;
  },

  /** Upload a single photo file for a car */
  async uploadPhoto(carId: string, file: File): Promise<CarPhoto> {
    const formData = new FormData();
    formData.append("file", file);

    const res = await apiClient.post(endpoints.cars.photos(carId), formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data;
  },

  /** Delete a photo by photoId */
  async deletePhoto(carId: string, photoId: string): Promise<{ success: boolean }> {
    const res = await apiClient.delete(endpoints.cars.photoDelete(carId, photoId));
    return res.data.data;
  },

  /** Set photo as primary */
  async setPrimary(carId: string, photoId: string): Promise<CarPhoto> {
    const res = await apiClient.patch(endpoints.cars.photoPrimary(carId, photoId));
    return res.data.data;
  },

  /** Download raw photo binary blob */
  async getPhotoFileBlob(carId: string, photoId: string): Promise<Blob> {
    const res = await apiClient.get(endpoints.cars.photoFile(carId, photoId), {
      responseType: "blob",
    });
    return res.data;
  },
};
