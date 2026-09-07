export interface DossierCar {
  id: string;
  make: string;
  model: string;
  year: number;
  reg_number: string;
  km_driven: number | null;
  fuel_type: string | null;
  transmission: string | null;
  color: string | null;
  primary_photo_url: string | null;
  photos: string[];
}

export interface DossierPurchase {
  purchase_amount: string;
  seller_name: string;
  seller_phone: string;
  purchased_by: {
    id: string;
    name: string;
  };
  purchased_at: string | null;
}

export interface DossierDocument {
  id: string;
  doc_type: string;
  doc_category: string;
  file_name: string | null;
  file_url: string;
  mime_type?: string | null;
  uploaded_by: {
    name: string;
  };
  uploaded_at: string | null;
}

export interface DossierRefurbItem {
  id: string;
  item_name: string;
  cost: string;
  vendor_type: string | null;
  vendor_name: string | null;
  status: string;
  completed_at: string | null;
}

export interface DossierRefurbishment {
  items: DossierRefurbItem[];
  refurb_total: string;
}

export interface DossierPricing {
  purchase_amount: string;
  refurb_total: string;
  landing_price: string;
  margin: string;
  selling_price: string;
}

export interface DossierStock {
  stock_added_at: string | null;
}

export interface DossierLifecycleItem {
  from_status: string | null;
  to_status: string;
  changed_by: {
    name: string;
  };
  notes: string | null;
  created_at: string | null;
}

export interface DossierBookingDocumentRef {
  created_at: string | null;
  pdf_url: string;
}

export interface DossierOrderFormRef {
  exists: boolean;
  created_at: string | null;
  pdf_url: string;
}

export interface DossierRcTransferRef {
  rc_transfer_date: string | null;
  uploaded_at: string | null;
  rc_document_url: string | null;
  rc_note: string | null;
}

export interface DossierRcDocumentItem {
  id: string;
  file_name: string | null;
  mime_type: string | null;
  stream_url: string;
}

export interface DossierDeliveryImageItem {
  id: string;
  file_name: string | null;
  mime_type: string | null;
  stream_url: string;
}

export interface DossierBookingDocuments {
  advance_agreement: DossierBookingDocumentRef;
  order_form: DossierOrderFormRef;
  settlement: DossierBookingDocumentRef;
  delivery_note: DossierBookingDocumentRef;
  rc_transfer: DossierRcTransferRef;
  rc_documents?: DossierRcDocumentItem[];
  delivery_images?: DossierDeliveryImageItem[];
}

export interface DossierBooking {
  id: string;
  booking_number: string;
  booked_by: {
    id: string;
    name: string;
  };
  customer: {
    id: string;
    name: string;
    phone: string;
  } | null;
  prebooked_at: string | null;
  agreed_price: string;
  grand_total: string;
  amount_paid: string;
  rc_documents?: DossierRcDocumentItem[];
  delivery_images?: DossierDeliveryImageItem[];
  documents: DossierBookingDocuments;
}

export interface DossierSale {
  sold_by: {
    id: string;
    name: string;
  };
  closed_by: {
    id: string;
    name: string;
  };
  closed_at: string | null;
  final_sale_value: string;
  total_collected: string;
}

export interface CarDossier {
  car: DossierCar;
  purchase: DossierPurchase;
  documents: DossierDocument[];
  refurbishment: DossierRefurbishment;
  pricing: DossierPricing;
  stock: DossierStock;
  lifecycle: DossierLifecycleItem[];
  booking: DossierBooking;
  sale: DossierSale;
}
