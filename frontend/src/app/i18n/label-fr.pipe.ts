import { Pipe, PipeTransform } from '@angular/core';
import { CATEGORY_LABEL_FR, ENERGY_LABEL_FR, TAG_LABEL_FR, TREE_LABEL_FR } from './document-labels';
import { DocumentCategory } from '../property/document';

type UtilityType =
  | 'ELECTRICITY' | 'GAS' | 'WATER' |'FUEL_OIL'
  | 'PELLETS' | 'WOOD' | 'COAL' | 'SOLAR_PV';

@Pipe({ name: 'labelFr', standalone: true })
export class LabelFrPipe implements PipeTransform {
  transform(
    value: DocumentCategory | UtilityType | string | null | undefined,
    kind: 'category' | 'energy' | 'tree' | 'tag'
  ): string {
    if (value == null) return '';

    if (kind === 'category') {
      const v = value as DocumentCategory;
      return CATEGORY_LABEL_FR[v] ?? String(value);
    }

    if (kind === 'energy') {
      const v = value as UtilityType;
      return ENERGY_LABEL_FR[v] ?? String(value);
    }

    if (kind === 'tree') {
      return TREE_LABEL_FR[String(value)] ?? String(value);
    }

    // kind === 'tag'
    return TAG_LABEL_FR[String(value)] ?? String(value);
  }
}
