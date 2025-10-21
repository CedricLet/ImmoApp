import { DocumentCategory } from '../property/document';

export type EnergyType =
  | 'ELECTRICITY' | 'GAS' | 'WATER'
  | 'DISTRICT_HEATING' | 'FUEL_OIL'
  | 'WOOD_PELLETS' | 'SOLAR_PV';

export const CATEGORY_LABEL_FR: Record<DocumentCategory, string> = {
  CONTRACT: 'Contrat',
  INVOICE: 'Facture',
  TAX: 'Impôts',
  WORK: 'Travaux',
  INSURANCE: 'Assurance',
  PHOTO: 'Photo',
  OTHER: 'Autre',
  PEB: 'PEB',
};

export const ENERGY_LABEL_FR: Record<EnergyType, string> = {
  ELECTRICITY: 'Électricité',
  GAS: 'Gaz',
  WATER: 'Eau',
  DISTRICT_HEATING: 'Chauffage urbain',
  FUEL_OIL: 'Mazout',
  WOOD_PELLETS: 'Pellets de bois',
  SOLAR_PV: 'Solaire PV',
};

export const TREE_LABEL_FR: Record<string, string> = {
  'All documents': 'Tous les documents',
  'Works': 'Travaux',
  'Energy': 'Énergie',
  'Electricity': 'Électricité',
  'Gas': 'Gaz',
  'Water': 'Eau',
  'District heating': 'Chauffage urbain',
  'Fuel oil': 'Mazout',
  'Wood pellets': 'Pellets de bois',
  'Solar PV': 'Solaire PV',
  'Syndic': 'Syndic',
  'Syndic reports': 'Rapports de syndic',
  'Information': 'Informations',
  'Insurance': 'Assurance',
  'Tax': 'Impôts',
  'Contracts': 'Contrats',
  'Invoices': 'Factures',
  'PEB': 'PEB',
  'Photos': 'Photos',
  'Other': 'Autre',
};

export const TAG_LABEL_FR: Record<string, string> = {
  // --- Workflow / État du document ---
  TO_REVIEW: "À vérifier",
  TO_COMPLETE: "À compléter",
  TO_PAY: "À payer",
  PAID: "Payé",
  IMPORTANT: "Important",
  ARCHIVED: "Archivé",
  URGENT: "Urgent",
  FOLLOW_UP: "Suivi nécessaire",
  MISSING_PAGES: "Pages manquantes",
  NEEDS_SIGNATURE: "À signer",
  SIGNED: "Signé",
  TO_SEND: "À envoyer",
  SENT: "Envoyé",
  RECEIVED: "Reçu",
  DRAFT: "Brouillon",
  FINAL: "Final",
  DUPLICATE: "Doublon",
  OUTDATED: "Obsolète",

  // --- Finance / Comptabilité ---
  EXPENSE: "Dépense",
  RECURRING: "Récurrent",
  ONE_OFF: "Ponctuel",
  REFUND: "Remboursement",
  ADVANCE: "Acompte",
  DEPOSIT: "Dépôt",
  GUARANTEE: "Garantie",
  LATE_FEE: "Frais de retard",
  TAX_DEDUCTIBLE: "Déductible fiscalement",
  NON_DEDUCTIBLE: "Non déductible",
  VAT_INCLUDED: "TVA incluse",
  VAT_EXCLUDED: "TVA non incluse",
  VAT_6: "TVA 6%",
  VAT_12: "TVA 12%",
  VAT_21: "TVA 21%",

  // --- Intervenants / Rôles ---
  LANDLORD: "Propriétaire",
  TENANT: "Locataire",
  SYNDIC: "Syndic",
  PROVIDER: "Prestataire",
  CONTRACTOR: "Entrepreneur",
  INSURER: "Assureur",
  BROKER: "Courtier",

  // --- Zones du bien / équipements ---
  KITCHEN: "Cuisine",
  BATHROOM: "Salle de bain",
  ROOF: "Toiture",
  FACADE: "Façade",
  GARDEN: "Jardin",
  GARAGE: "Garage",
  BOILER_ROOM: "Chaufferie",
  ELECTRICAL: "Électricité",
  PLUMBING: "Plomberie",
  WINDOWS: "Fenêtres",
  INSULATION: "Isolation",

  // --- Types de travaux ---
  MAINTENANCE: "Entretien",
  REPAIR: "Réparation",
  RENOVATION: "Rénovation",
  INSTALLATION: "Installation",
  INSPECTION: "Inspection",
  EMERGENCY: "Urgence",

  // --- Utilitaires / Énergies ---
  ELECTRICITY: "Électricité",
  GAS: "Gaz",
  WATER: "Eau",
  DISTRICT_HEATING: "Chauffage urbain",
  FUEL_OIL: "Mazout",
  WOOD_PELLETS: "Pellets de bois",
  SOLAR_PV: "Solaire PV",
  INTERNET: "Internet",
  TELECOM: "Télécom",
  WASTE: "Déchets",
  SEWAGE: "Égouts",

  // --- Conformité / contrôles périodiques ---
  SAFETY_CHECK: "Contrôle sécurité",
  GAS_CHECK: "Contrôle gaz",
  ELECTRICAL_CHECK: "Contrôle électrique",
  BOILER_SERVICE: "Entretien chaudière",
  CHIMNEY_SWEEP: "Ramonnage",
  PEB_CERTIFICATE: "Certificat PEB",

  // --- Légal / contrats / bail ---
  LEASE: "Bail",
  TERMINATION: "Résiliation",
  AMENDMENT: "Avenant",
  ANNEX: "Annexe",
  INSPECTION_REPORT: "Rapport d’inspection",
  ENTRY_INVENTORY: "État des lieux d’entrée",
  EXIT_INVENTORY: "État des lieux de sortie",
  GUARANTEE_BOND: "Caution / Garantie locative",

  // --- Type documentaire ---
  INVOICE: "Facture",
  CONTRACT: "Contrat",
  RECEIPT: "Reçu",
  QUOTE: "Devis",
  QUOTE_APPROVED: "Devis approuvé",
  QUOTE_REJECTED: "Devis refusé",
  WARRANTY: "Garantie",
  CLAIM: "Réclamation",
  INSURANCE_POLICY: "Police d’assurance",
  SYNDIC_REPORT: "Rapport du syndic",
  TAX: "Impôts",
};

