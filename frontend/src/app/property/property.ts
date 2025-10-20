export enum PropertyType {
  HOUSE,
  APARTMENT,
  STUDIO,
  PARKING,
  CELLAR,
  LAND,
  BUILDING_PART,
  OTHER,
}

export enum PropertyStatus {
  OWNER_OCCUPIED,
  RENTED,
  FOR_RENT,
  FOR_SALE,
  WORKS,
  DISABLED,
}

export enum ContextRole {
  OWNER,
  AGENT_GESTIONNAIRE,
  TENANT,
  SYNDIC_READER,
}

export type Property = {
  imagePath: string;
  label: string;
  propertyType: PropertyType;
  propertyStatus: PropertyStatus;
  street: string;
  postalCode: string;
  city: string;
  country: string;
  contextRole: ContextRole;
  yearBuilt: number;
  surface: number;
  pebScore: string;
  notes: string;
};

export type Properties = {
  id: number;
  propertyType: PropertyType;
  label: string;
  city: string;
  imagePath: string;
};
