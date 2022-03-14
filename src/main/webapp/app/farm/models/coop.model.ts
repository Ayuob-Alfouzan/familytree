import { LongFilter, StringFilter } from 'app/shared/models/criteria.model';
import { LookupModel } from 'app/shared/models/lookup.model';
import { ChickModel } from './chick.model';
import { EggModel } from './egg.model';

export interface CoopModel {
  id: number;
  warehouseId: number;
  name: string;
  maleStatus: LookupModel;
  femaleStatus: LookupModel;
  emptySince: number;
  recordActivity: boolean;
  eggs: EggModel[];
  chicks: ChickModel[];
}

export interface SimpleCoopModel {
  id: number;
  name: string;
}

export interface CoopCriteria {
  warehouseId: LongFilter;
  maleStatusCode?: StringFilter;
  femaleStatusCode?: StringFilter;
  name?: StringFilter;
}

export interface AddCoopModel {
  warehouseId: number;
  name: number;
}

export interface DeleteCoopModel {
  warehouseId: number;
  coopId: number;
}

export interface GetCoopModel {
  warehouseId: number;
  coopId: number;
}

export interface ChangeCoopStatusModel {
  warehouseId: number;
  coopId: number;
  isMale: boolean;
  newStatus: String;
}
