// src/features/cars/types/document-types.ts

export type DocumentType =
  | "rc_book"
  | "seller_pan"
  | "seller_aadhaar"
  | "noc"
  | "insurance"
  | "pollution"
  | "second_key"
  | "purchase_photo"
  | "form_29c"
  | "service_history";

export interface CarDocumentFile {
  id: string;
  car_id: string;
  document_type: DocumentType;
  doc_category: string;
  file_path: string;
  file_url?: string;
  original_name: string;
  file_name?: string;
  file_size_kb?: number | null;
  mime_type: string;
  created_at: string;
}

export interface GroupedDocType {
  doc_type: DocumentType;
  doc_category: string;
  kind: "pdf" | "image";
  files: CarDocumentFile[];
  count: number;
}

export type CarDocument = CarDocumentFile;

export interface UploadDocumentPayload {
  carId: string;
  documentType: DocumentType;
  files: File[];
}

export function normalizeGroupedDocuments(data: unknown[]): GroupedDocType[] {
  if (!Array.isArray(data)) return [];
  if (data.length === 0) return [];

  const rawArray = data as Record<string, unknown>[];

  if (rawArray[0] && "doc_type" in rawArray[0] && Array.isArray(rawArray[0].files)) {
    return rawArray.map((group) => {
      const files = (group.files as Record<string, unknown>[]) || [];
      return {
        doc_type: group.doc_type as DocumentType,
        doc_category: (group.doc_category as string) || "soft",
        kind: (group.kind as "pdf" | "image") || "image",
        files: files.map((f) => ({
          id: String(f.id || ""),
          car_id: String(f.car_id || f.carId || ""),
          document_type: (f.document_type || f.docType || group.doc_type) as DocumentType,
          doc_category: String(f.doc_category || f.docCategory || group.doc_category || "soft"),
          file_path: String(f.file_path || f.fileUrl || ""),
          file_url: (f.file_url || f.url || f.file_path || f.fileUrl) as string | undefined,
          original_name: String(f.original_name || f.fileName || f.file_name || "Document"),
          file_name: (f.file_name || f.fileName) as string | undefined,
          file_size_kb: (f.file_size_kb || f.fileSizeKb) as number | null | undefined,
          mime_type: String(f.mime_type || f.mimeType || "image/jpeg"),
          created_at: String(f.created_at || f.createdAt || new Date().toISOString()),
        })),
        count: typeof group.count === "number" ? group.count : files.length,
      };
    });
  }

  const groupsMap = new Map<string, CarDocumentFile[]>();
  for (const item of rawArray) {
    const docType = (item.document_type || item.doc_type) as string | undefined;
    if (!docType) continue;
    if (!groupsMap.has(docType)) {
      groupsMap.set(docType, []);
    }
    groupsMap.get(docType)!.push({
      id: String(item.id || ""),
      car_id: String(item.car_id || item.carId || ""),
      document_type: docType as DocumentType,
      doc_category: String(item.doc_category || item.docCategory || "soft"),
      file_path: String(item.file_path || item.fileUrl || ""),
      file_url: (item.file_url || item.url || item.file_path || item.fileUrl) as string | undefined,
      original_name: String(item.original_name || item.fileName || item.file_name || "Document"),
      file_name: (item.file_name || item.fileName) as string | undefined,
      file_size_kb: (item.file_size_kb || item.fileSizeKb) as number | null | undefined,
      mime_type: String(item.mime_type || item.mimeType || "image/jpeg"),
      created_at: String(item.created_at || item.createdAt || new Date().toISOString()),
    });
  }

  const result: GroupedDocType[] = [];
  for (const [docType, files] of groupsMap.entries()) {
    const kind = files.some((f) => f.mime_type === "application/pdf") ? "pdf" : "image";
    result.push({
      doc_type: docType as DocumentType,
      doc_category: files[0]?.doc_category || "soft",
      kind,
      files,
      count: files.length,
    });
  }
  return result;
}
export interface DocumentConfigItem {
  type: DocumentType;
  label: string;
  description: string;
  isHardDoc: boolean;
  optional?: boolean;
}

export const DOCUMENT_CONFIGS: DocumentConfigItem[] = [
  // --- HARD DOCS (Mandatory for Refurbishment) ---
  {
    type: "rc_book",
    label: "RC Book",
    description: "Original Registration Certificate",
    isHardDoc: true,
    optional: false,
  },
  {
    type: "purchase_photo",
    label: "Purchase Photo",
    description: "Handover photo at the time of purchase",
    isHardDoc: true,
    optional: false,
  },
  // --- SOFT DOCS (Optional / Pending) ---
  {
    type: "seller_aadhaar",
    label: "Seller Aadhaar",
    description: "Front & back image of Aadhaar",
    isHardDoc: false,
    optional: false,
  },
  {
    type: "seller_pan",
    label: "Seller PAN",
    description: "PAN card for tax compliance",
    isHardDoc: false,
    optional: false,
  },
  {
    type: "noc",
    label: "NOC",
    description: "No Objection Certificate from RTO/Bank",
    isHardDoc: false,
    optional: false,
  },
  {
    type: "insurance",
    label: "Insurance",
    description: "Current active motor insurance policy",
    isHardDoc: false,
    optional: false,
  },
  {
    type: "pollution",
    label: "Pollution (PUC)",
    description: "Valid Pollution Under Control certificate",
    isHardDoc: false,
    optional: false,
  },
  {
    type: "second_key",
    label: "Second Key Photo",
    description: "Photographic proof of the spare key",
    isHardDoc: false,
    optional: true,
  },
  {
    type: "form_29c",
    label: "Form 29/30",
    description: "Signed ownership transfer forms",
    isHardDoc: false,
    optional: true,
  },
  {
    type: "service_history",
    label: "Service History",
    description: "Vehicle service & maintenance records",
    isHardDoc: false,
    optional: true,
  },
];
