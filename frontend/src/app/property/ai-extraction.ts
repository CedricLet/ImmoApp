export type AiExtraction = {
  documentCategory: 'CONTRACT'|'INVOICE'|'TAX'|'WORK'|'INSURANCE'|'PHOTO'|'OTHER'|'PEB' | null;
  utilityType: 'ELECTRICITY'|'GAS'|'WATER'|'FUEL_OIL'|'PELLETS'|'WOOD'|'COAL'|'SOLAR_PV' | null;
  tags: string[];
  suggestedFileName: string | null;
};
