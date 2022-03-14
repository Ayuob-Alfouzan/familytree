import { DateRangeFilter, LongFilter, StringFilter } from 'app/shared/models/criteria.model';
import { LookupModel } from 'app/shared/models/lookup.model';
import { SimpleSheepModel } from './sheep.model';

export interface SheepTreatmentModel {
  id: number;
  farmId: number;
  type: LookupModel;
  name: string;
  doseType: LookupModel;
  numberOfDays: number;
  startingDate: Date;
  all: boolean;
  specificSheep: boolean;
  sheepType: LookupModel;
  sheepTreatmentSheep: SheepTreatmentSheepModel[];
  recordActivity: boolean;
}

export interface SheepTreatmentSheepModel {
  id: number;
  sheepTreatmentId: number;
  sheep: SimpleSheepModel;
  recordActivity: boolean;
}

export interface SheepTreatmentCriteria {
  farmId: LongFilter;
  typeCode?: StringFilter;
}

export interface AddSheepTreatmentModel {
  farmId: number;
  type: string;
  name: string;
  doseType: string;
  numberOfDays: number;
  startingDate: Date;
  sheepType?: string;
  sheep?: number[];
}

export interface UpdateSheepTreatmentModel {
  sheepTreatmentId: number;
  type: string;
  name: string;
  doseType: string;
  numberOfDays: number;
  startingDate: Date;
  sheepType?: string;
  sheep?: number[];
}
