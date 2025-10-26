export enum DocumentCategory {
  CONTRACT = 'CONTRACT',
  INVOICE = 'INVOICE',
  TAX = 'TAX',
  WORK = 'WORK',
  INSURANCE = 'INSURANCE',
  PHOTO = 'PHOTO',
  OTHER = 'OTHER',
  PEB = 'PEB',
}

export type DocumentTag = {
  id: number;
  name: string;
};

export type Document = {
  id: number;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  storagePath: string;
  documentCategory: DocumentCategory;
  uploadedAt: string;
  propertyId?: number;
  utilityType?: 'ELECTRICITY' | 'GAS' | 'WATER' | 'FUEL_OIL' | 'PELLETS' | 'WOOD' | 'COAL' | 'SOLAR_PV' | null;
  tags: string[];
};

export type DocumentListResponse = {
  content: Document[];
  totalElements: number;
}
