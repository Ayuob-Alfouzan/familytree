import { LongFilter, StringFilter, DateRangeFilter } from 'app/shared/models/criteria.model';
import { LookupModel } from 'app/shared/models/lookup.model';

export interface ChickModel {
  id: number;
  coopId: number;
  eggId: number;
  hatchingDate: Date;
  lastActionDate: Date;
  status: LookupModel;
  recordActivity: boolean;
}

export interface ChickCriteria {
  coopId: LongFilter;
  statusCode?: StringFilter;
  hatchingDate?: DateRangeFilter;
}

export interface AddChickModel {
  coopId: number;
  hatchingDate: string;
}

export interface DeleteChickModel {
  coopId: number;
  chickId: number;
}

export interface ChangeChickStatusModel {
  coopId: number;
  chickId: number;
  newStatus: String;
}
