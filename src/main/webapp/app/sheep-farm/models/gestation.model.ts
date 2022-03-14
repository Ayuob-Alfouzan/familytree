import { DateRangeFilter, LongFilter, StringFilter } from 'app/shared/models/criteria.model';
import { LookupModel } from 'app/shared/models/lookup.model';
import { SimpleSheepModel } from './sheep.model';

export interface GestationModel {
  id: number;
  ewe: SimpleSheepModel;
  ram: SimpleSheepModel;
  lamb: SimpleSheepModel;
  impregnationDate: Date;
  lambingDate: Date;
  status: LookupModel;
  numberOfWeeks: number;
  recordActivity: boolean;
  numberOfLambs: number;
}

export interface GestationCriteria {
  eweId?: LongFilter;
  ramId?: LongFilter;
  impregnationDate?: DateRangeFilter;
  lambingDate?: DateRangeFilter;
  statusCode?: StringFilter;
}

export interface AddGestationModel {
  eweId: number;
  ramId: number;
  impregnationDate: string;
  numberOfLambs: number;
}

export interface UpdateGestationModel {
  gestationId: number;
  impregnationDate: string;
  numberOfLambs: number;
}

export interface LambedGestationModel {
  gestationId: number;
  lambingDate: string;
  lambedGestationDetailsRequestVMList: LambedGestationDetailsModel[];
}

export interface LambedGestationDetailsModel {
  number: string;
  gender: string;
}

export interface AbortedGestationModel {
  gestationId: number;
  endDate: string;
}

export interface DeleteGestationModel {
  gestationId: number;
}
