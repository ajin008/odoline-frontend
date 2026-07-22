import { apiClient } from "@/src/lib/api-client";
import { endpoints } from "@/src/lib/endpoints";
import { DocumentType, CarDocument } from "../type/document-types";

export interface UploadDocumentPayload {
  carId: string;
  documentType: DocumentType;
  file: File;
}

export const documentsApi = {
  /** Fetch all uploaded documents for a specific car */
  async getList(carId: string): Promise<CarDocument[]> {
    const res = await apiClient.get(endpoints.cars.documents(carId));
    return res.data.data;
  },

  /** Upload a document image */
  async upload({
    carId,
    documentType,
    file,
  }: UploadDocumentPayload): Promise<CarDocument> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("doc_type", documentType);

    const res = await apiClient.post(
      endpoints.cars.documents(carId),
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return res.data.data;
  },

  /** Get a 15-minute presigned URL for viewing the image */
  async getPresignedUrl(carId: string, documentId: string): Promise<string> {
    const res = await apiClient.get(
      `${endpoints.cars.documents(carId)}/${documentId}/download`
    );
    return res.data.data.url;
  },

  /** Delete a document */
  async delete(carId: string, documentId: string): Promise<void> {
    await apiClient.delete(`${endpoints.cars.documents(carId)}/${documentId}`);
  },
};
