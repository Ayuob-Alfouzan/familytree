import { LongFilter, StringFilter, DateRangeFilter } from 'app/shared/models/criteria.model';
import { LookupModel } from 'app/shared/models/lookup.model';

export interface EggModel {
  id: number;
  coopId: number;
  layDate: Date;
  lastActionDate: Date;
  status: LookupModel;
  recordActivity: boolean;
}

export interface EggCriteria {
  coopId: LongFilter;
  statusCode?: StringFilter;
  layDate?: DateRangeFilter;
}

export interface AddEggModel {
  coopId: number;
  layDate: string;
}

export interface DeleteEggModel {
  coopId: number;
  eggId: number;
}

export interface ChangeEggStatusModel {
  coopId: number;
  eggId: number;
  newStatus: String;
}
