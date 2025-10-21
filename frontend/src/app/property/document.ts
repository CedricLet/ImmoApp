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
  energyType?: 'ELECTRICITY' | 'GAS' | 'WATER' | 'DISTRICT_HEATING' | 'FUEL_OIL' | 'WOOD_PELLETS' | 'SOLAR_PV' | null;
  tags: string[];
};

export type DocumentListResponse = {
  content: Document[];
  totalElements: number;
}
