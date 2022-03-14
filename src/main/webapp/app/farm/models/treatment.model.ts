import { DateRangeFilter, LongFilter, StringFilter } from 'app/shared/models/criteria.model';
import { LookupModel } from 'app/shared/models/lookup.model';
import { SimpleCoopModel } from './coop.model';

export interface TreatmentModel {
  id: number;
  warehouseId: number;
  allWarehouse: boolean;
  type: LookupModel;
  firstDoseDate: Date;
  secondDoseDate: Date;
  description: string;
  recordActivity: boolean;
  coops: SimpleCoopModel[];
}

export interface TreatmentCriteria {
  warehouseId: LongFilter;
  typeCode?: StringFilter;
  firstDoseDate?: DateRangeFilter;
}

export interface AddTreatmentModel {
  warehouseId: number;
  typeCode: string;
  secondDoseDate: Date;
  coopIds: number[];
  description: string;
}

export interface DeleteTreatmentModel {
  warehouseId: number;
  treatmentId: number;
}
