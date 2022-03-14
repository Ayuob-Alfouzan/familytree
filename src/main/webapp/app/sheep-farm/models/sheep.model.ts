import { LongFilter, StringFilter } from 'app/shared/models/criteria.model';
import { LookupModel } from 'app/shared/models/lookup.model';
import { GestationModel } from './gestation.model';

export interface SheepModel {
  id: number;
  farmId: number;
  number: string;
  name: string;
  category: LookupModel;
  type: LookupModel;
  status: LookupModel;
  gender: LookupModel;
  ageInDays: number;
  ageInMonths: number;
  ageInYears: number;
  recordActivity: boolean;
  father?: SimpleSheepModel;
  mother?: SimpleSheepModel;
  fatherName?: string;
  motherName?: string;
}

export interface SheepStatusModel {
  id: number;
  type: LookupModel;
  status: LookupModel;
  gestation?: GestationModel;
}

export interface SimpleSheepModel {
  id: number;
  number: string;
  name: string;
}

export interface SheepCriteria {
  farmId: LongFilter;
  number?: StringFilter;
  name?: StringFilter;
  categoryCode?: StringFilter;
  typeCode?: StringFilter;
  statusCode?: StringFilter;
  fatherId?: LongFilter;
  motherId?: LongFilter;
}

export interface AddSheepModel {
  farmId: number;
  number: string;
  name?: string;
  category: string;
  type: string;
  gender: string;
  ageInDays: number;
  ageInMonths: number;
  ageInYears: number;
  fatherId: number;
  motherId: number;
  fatherName: string;
  motherName: string;
}

export interface UpdateSheepModel {
  sheepId: number;
  number: string;
  name?: string;
  category: string;
  type: string;
  gender: string;
  status: string;
  ageInDays: number;
  ageInMonths: number;
  ageInYears: number;
  fatherId: number;
  motherId: number;
  fatherName: string;
  motherName: string;
}

export interface DeleteSheepModel {
  sheepId: number;
}

export interface GetSheepModel {
  warehouseId: number;
  coopId: number;
}

export interface ChangeSheepStatusModel {
  warehouseId: number;
  coopId: number;
  isMale: boolean;
  newStatus: String;
}

export interface DashboardModel {
  numberOfIncomeFinancialTransactions: number;
  numberOfExpenseFinancialTransactions: number;
  financialStatus: number;
  numberOfSheep: number;
  numberOfUsers: number;
  numberOfSheepVaccinations: number;
  numberOfSheepTreatments: number;
}
