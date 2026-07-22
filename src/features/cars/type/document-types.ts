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
  | "form_29c";

export interface CarDocument {
  id: string;
  car_id: string;
  document_type: DocumentType;
  file_path: string;
  original_name: string;
  mime_type: string;
  created_at: string;
}

export interface UploadDocumentPayload {
  carId: string;
  documentType: DocumentType;
  file: File;
}
export interface DocumentConfigItem {
  type: DocumentType;
  label: string;
  description: string;
  isHardDoc: boolean;
}

export const DOCUMENT_CONFIGS: DocumentConfigItem[] = [
  // --- HARD DOCS (Mandatory for Refurbishment) ---
  {
    type: "rc_book",
    label: "RC Book",
    description: "Original Registration Certificate",
    isHardDoc: true,
  },
  {
    type: "purchase_photo",
    label: "Purchase Photo",
    description: "Handover photo at the time of purchase",
    isHardDoc: true,
  },
  // --- SOFT DOCS (Optional / Pending) ---
  {
    type: "seller_aadhaar",
    label: "Seller Aadhaar",
    description: "Front & back image of Aadhaar",
    isHardDoc: false,
  },
  {
    type: "seller_pan",
    label: "Seller PAN",
    description: "PAN card for tax compliance",
    isHardDoc: false,
  },
  {
    type: "noc",
    label: "NOC",
    description: "No Objection Certificate from RTO/Bank",
    isHardDoc: false,
  },
  {
    type: "insurance",
    label: "Insurance",
    description: "Current active motor insurance policy",
    isHardDoc: false,
  },
  {
    type: "pollution",
    label: "Pollution (PUC)",
    description: "Valid Pollution Under Control certificate",
    isHardDoc: false,
  },
  {
    type: "second_key",
    label: "Second Key Photo",
    description: "Photographic proof of the spare key",
    isHardDoc: false,
  },
  {
    type: "form_29c",
    label: "Form 29/30",
    description: "Signed ownership transfer forms",
    isHardDoc: false,
  },
];
