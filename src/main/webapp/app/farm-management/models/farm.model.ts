import { StringFilter } from 'app/shared/models/criteria.model';
import { LookupModel } from 'app/shared/models/lookup.model';

export interface FarmListModel {
  id: number;
  type: LookupModel;
  nameAr: String;
  nameEn: String;
  location: String;
  recordActivity: Boolean;
}

export interface FarmCriteria {
  name: StringFilter;
}

export interface AddFarmModel {
  nameAr: string;
  nameEn: string;
  type: string;
  location: string;
  vatNumber?: string;
}

export interface FarmModel {
  id: number;
  type: LookupModel;
  nameAr: string;
  nameEn: string;
  location: string;
  vatNumber: string;
  recordActivity: boolean;
  familyTreeUsers: FarmUserModel[];
}

export interface FarmUserModel {
  id: number;
  farmId: number;
  farmNameAr: string;
  farmNameEn: string;
  userId: number;
  userFirstName: string;
  userLastName: string;
  userEmail: string;
  type: LookupModel;
  recordActivity: boolean;
  added: boolean; // only for warehouse user management
}

export interface EditFarmModel {
  id: number;
  nameAr: string;
  nameEn: string;
  location: string;
  vatNumber?: string;
}

export interface AddUserModel {
  id: number;
  userEmail: string;
  farmUserType: string;
}

export interface RemoveUserModel {
  id: number;
  userId: number;
}

export interface FindSuitableUserModel {
  farmId: number;
  email: string;
}

export interface SuitableUserModel {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface DashboardModel {
  numberOfIncomeFinancialTransactions: number;
  numberOfExpenseFinancialTransactions: number;
  financialStatus: number;
  numberOfWarehouses: number;
  numberOfUsers: number;
}
