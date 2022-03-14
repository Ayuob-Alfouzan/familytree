import { DateRangeFilter, LongFilter, StringFilter } from 'app/shared/models/criteria.model';
import { LookupModel } from 'app/shared/models/lookup.model';

export interface SheepVaccinationModel {
  id: number;
  farmId: number;
  type: LookupModel;
  name: string;
  recordActivity: boolean;
  sheepVaccinationDoses: SheepVaccinationDoseModel[];
  sheepVaccinationHistories: SheepVaccinationHistoryModel[];
}

export interface SheepVaccinationDoseModel {
  id: number;
  sheepVaccinationId: number;
  month: number;
  day: number;
  recordActivity: boolean;
}

export interface SheepVaccinationHistoryModel {
  id: number;
  sheepVaccinationId: number;
  doseDate: Date;
  recordActivity: boolean;
}

export interface SheepVaccinationCriteria {
  farmId: LongFilter;
  typeCode?: StringFilter;
}

export interface AddSheepVaccinationModel {
  farmId: number;
  type: string;
  name: string;
  sheepVaccinationDoses: VaccinationDoseDateModel[];
}

export interface VaccinationDoseDateModel {
  month: number;
  day: number;
}

export interface UpdateSheepVaccinationModel {
  sheepVaccinationId: number;
  type: string;
  name: string;
  sheepVaccinationDoses: VaccinationDoseDateModel[];
}

export interface AddSheepVaccinationHistoryModel {
  sheepVaccinationId: number;
  date: Date;
}

export interface DeleteSheepVaccinationHistoryModel {
  sheepVaccinationId: number;
  sheepVaccinationHistoryId: number;
}
