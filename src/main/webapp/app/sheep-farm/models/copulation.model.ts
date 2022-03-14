import { DateRangeFilter, LongFilter, StringFilter } from 'app/shared/models/criteria.model';
import { LookupModel } from 'app/shared/models/lookup.model';
import { SimpleSheepModel } from './sheep.model';

export interface CopulationModel {
  id: number;
  ewe: SimpleSheepModel;
  rm: SimpleSheepModel;
  impregnationDate: Date;
  recordActivity: boolean;
  status: LookupModel;
}

export interface CopulationCriteria {
  eweId?: LongFilter;
  ramId?: LongFilter;
  impregnationDate?: DateRangeFilter;
}

export interface AddCopulationModel {
  eweId: number;
  ramId: number;
  impregnationDate: string;
}

export interface DeleteCopulationModel {
  copulationId: number;
}

export interface ConfirmCopulationModel {
  copulationId: number;
  impregnationDate?: string;
  numberOfLambs: number;
}

export interface FalseCopulationModel {
  copulationId: number;
}
