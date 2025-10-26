import { UserType } from '../user/user';
import { PropertyStatus, PropertyType, ContextRole } from '../property/property';

export const USER_TYPE_LABEL_FR: Record<keyof typeof UserType, string> = {
  ADMIN: 'Administrateur',
  EMPLOYEE: 'Employé',
  OWNER: 'Propriétaire',
  AGENT: 'Agent immobilier',
  SYNDIC: 'Syndic',
  TENANT: 'Locataire',
  INTERNSHIP: 'Stagiaire',
};

export const PROPERTY_TYPE_LABEL_FR: Record<keyof typeof PropertyType, string> = {
  HOUSE: 'Maison',
  APARTMENT: 'Appartement',
  STUDIO: 'Studio',
  PARKING: 'Parking',
  CELLAR: 'Cave',
  LAND: 'Terrain',
  BUILDING_PART: 'Partie d’immeuble',
  OTHER: 'Autre',
};

export const PROPERTY_STATUS_LABEL_FR: Record<keyof typeof PropertyStatus, string> = {
  OWNER_OCCUPIED: 'Occupé par le propriétaire',
  RENTED: 'Loué',
  FOR_RENT: 'À louer',
  FOR_SALE: 'À vendre',
  WORKS: 'En travaux',
  DISABLED: 'Désactivé',
};

export const CONTEXT_ROLE_LABEL_FR: Record<keyof typeof ContextRole, string> = {
  OWNER: 'Propriétaire',
  AGENT_GESTIONNAIRE: 'Agent / Gestionnaire',
  TENANT: 'Locataire',
  SYNDIC_READER: 'Syndic (lecture)',
};
