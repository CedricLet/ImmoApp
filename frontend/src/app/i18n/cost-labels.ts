import { CostType, CostCategory } from '../cost/costType';

export const COST_TYPE_LABEL_FR: Record<keyof typeof CostType, string> = {
  EXPENSES: 'Dépenses',
  EARNINGS: 'Recettes',
};

export const COST_CATEGORY_LABEL_FR: Record<keyof typeof CostCategory, string> = {
  // Utilitaires / énergies
  ELECTRICITY: 'Électricité',
  GAS: 'Gaz',
  WATER: 'Eau',
  INTERNET: 'Internet',
  PHOTOVOLTAIC: 'Photovoltaïque',
  FUEL: 'Carburant / Mazout',
  WASTE: 'Déchets',

  // Assurances
  INSURANCE: 'Assurance (général)',
  INSURANCE_HOME: 'Assurance habitation',
  INSURANCE_LANDLORD: 'Assurance propriétaire',
  INSURANCE_PAYOUT: 'Indemnité d’assurance',

  // Taxes / redevances
  TAX: 'Impôts (général)',
  TAX_PROPERTY: 'Précompte immobilier',
  TAX_CITY: 'Taxe communale',

  // Charges de copro / immeuble
  CONDO_FEES: 'Charges de copropriété',
  ELEVATOR_SERVICE: 'Entretien ascenseur',
  BOILER_SERVICE: 'Entretien chaudière',
  PEST_CONTROL: 'Dératisation / Désinsectisation',
  SECURITY: 'Sécurité',

  // Entretien / travaux
  MAINTENANCE: 'Entretien',
  REPAIRS: 'Réparations',
  RENOVATION: 'Rénovation',
  GARDENING: 'Jardinage',
  CLEANING: 'Nettoyage',
  SUPPLIES: 'Fournitures',
  WORK: 'Travaux (général)',

  // Juridique / financier
  LEGAL_FEES: 'Frais juridiques',
  INTEREST: 'Intérêts',
  LATE_FEE: 'Frais de retard',
  DEPOSIT_WITHHELD: 'Caution retenue',

  // Loyers et refacturations
  RENT: 'Loyer',
  RENT_PARKING: 'Loyer parking',
  RENT_STORAGE: 'Loyer cave/box',
  SERVICE_CHARGE: 'Charges locatives',
  UTILITY_REBILL_ELECTRICITY: 'Refacturation électricité',
  UTILITY_REBILL_GAS: 'Refacturation gaz',
  UTILITY_REBILL_WATER: 'Refacturation eau',

  // Autres recettes
  ENERGY_FEED_IN: 'Injection énergie (revente)',
  SUBSIDY: 'Subvention',
  OTHER_EARNINGS: 'Autres recettes',

  // Divers
  OTHER_EXPENSES: 'Autres dépenses',
};
