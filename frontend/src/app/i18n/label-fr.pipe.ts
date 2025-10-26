import { Pipe, PipeTransform } from '@angular/core';
import { CATEGORY_LABEL_FR, ENERGY_LABEL_FR, TAG_LABEL_FR, TREE_LABEL_FR } from './document-labels';
import { DocumentCategory } from '../property/document';
import { COST_TYPE_LABEL_FR, COST_CATEGORY_LABEL_FR} from './cost-labels';
import { CostType, CostCategory} from '../cost/costType';

import { USER_TYPE_LABEL_FR, PROPERTY_TYPE_LABEL_FR, PROPERTY_STATUS_LABEL_FR, CONTEXT_ROLE_LABEL_FR } from './app-labels';
import { UserType } from '../user/user';
import { PropertyStatus, PropertyType, ContextRole } from '../property/property';

type UtilityType =
  | 'ELECTRICITY' | 'GAS' | 'WATER' | 'FUEL_OIL'
  | 'PELLETS' | 'WOOD' | 'COAL' | 'SOLAR_PV';

type Kind =
  | 'category'
  | 'energy'
  | 'tree'
  | 'tag'
  | 'userType'
  | 'propertyType'
  | 'propertyStatus'
  | 'contextRole'
  | 'costType'
  | 'costCategory';

@Pipe({ name: 'labelFr', standalone: true })
export class LabelFrPipe implements PipeTransform {
  transform(
    value: DocumentCategory | UtilityType | string | number | null | undefined,
    kind: Kind
  ): string {
    if (value == null) return '';

    // --- Documents (déjà existant)
    if (kind === 'category') return CATEGORY_LABEL_FR[value as DocumentCategory] ?? String(value);
    if (kind === 'energy')   return ENERGY_LABEL_FR[value as UtilityType] ?? String(value);
    if (kind === 'tree')     return TREE_LABEL_FR[String(value)] ?? String(value);
    if (kind === 'tag')      return TAG_LABEL_FR[String(value)] ?? String(value);

    // --- Enums "app" (nouveaux)
    // On tolère valeur string (backend envoie les noms) OU valeur number (enum TS numérique)
    if (kind === 'userType') {
      const key = typeof value === 'number' ? (UserType as any)[value] : String(value);
      return USER_TYPE_LABEL_FR[key as keyof typeof UserType] ?? String(value);
    }

    if (kind === 'propertyType') {
      const key = typeof value === 'number' ? (PropertyType as any)[value] : String(value);
      return PROPERTY_TYPE_LABEL_FR[key as keyof typeof PropertyType] ?? String(value);
    }

    if (kind === 'propertyStatus') {
      const key = typeof value === 'number' ? (PropertyStatus as any)[value] : String(value);
      return PROPERTY_STATUS_LABEL_FR[key as keyof typeof PropertyStatus] ?? String(value);
    }

    if (kind === 'contextRole') {
      const key = typeof value === 'number' ? (ContextRole as any)[value] : String(value);
      return CONTEXT_ROLE_LABEL_FR[key as keyof typeof ContextRole] ?? String(value);
    }

    if (kind === 'costType') {
      const key = typeof value === 'number' ? (CostType as any)[value] : String(value);
      return COST_TYPE_LABEL_FR[key as keyof typeof CostType] ?? String(value);
    }

    if (kind === 'costCategory') {
      const key = typeof value === 'number' ? (CostCategory as any)[value] : String(value);
      return COST_CATEGORY_LABEL_FR[key as keyof typeof CostCategory] ?? String(value);
    }

    return String(value);
  }
}
