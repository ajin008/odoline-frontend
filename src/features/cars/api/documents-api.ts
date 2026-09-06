import { apiClient } from "@/src/lib/api-client";
import { endpoints } from "@/src/lib/endpoints";
import {
  GroupedDocType,
  UploadDocumentPayload,
  normalizeGroupedDocuments,
} from "../type/document-types";

export type { UploadDocumentPayload };

export const documentsApi = {
  /** Fetch all uploaded documents for a specific car (normalized to grouped structure) */
  async getList(carId: string): Promise<GroupedDocType[]> {
    const res = await apiClient.get(endpoints.cars.documents(carId));
    return normalizeGroupedDocuments(res.data.data || []);
  },

  /** Upload multiple document images or a PDF */
  async upload({
    carId,
    documentType,
    files,
  }: UploadDocumentPayload): Promise<GroupedDocType> {
    const formData = new FormData();
    formData.append("doc_type", documentType);
    for (const file of files) {
      formData.append("files", file);
    }

    const res = await apiClient.post(
      endpoints.cars.documents(carId),
      formData
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

  /** Download raw document file blob directly from backend (bypasses CORS) */
  async downloadFileBlob(carId: string, documentId: string): Promise<Blob> {
    const res = await apiClient.get(
      `${endpoints.cars.documents(carId)}/${documentId}/file`,
      { responseType: "blob" }
    );
    return res.data;
  },

  /** Delete a document */
  async delete(carId: string, documentId: string): Promise<void> {
    await apiClient.delete(`${endpoints.cars.documents(carId)}/${documentId}`);
  },
};
