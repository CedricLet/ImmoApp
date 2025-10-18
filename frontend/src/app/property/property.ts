export enum PropertyType {
  HOUSE,
  APPARTEMENT,
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
