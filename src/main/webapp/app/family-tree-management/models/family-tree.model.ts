import { StringFilter } from 'app/shared/models/criteria.model';
import { LookupModel } from 'app/shared/models/lookup.model';

export interface FamilyTreeListModel {
  id: number;
  type: LookupModel;
  nameAr: String;
  nameEn: String;
  location: String;
  recordActivity: Boolean;
}

export interface FamilyTreeCriteria {
  name: StringFilter;
}

export interface AddFamilyTreeModel {
  nameAr: string;
  nameEn: string;
  type: string;
  location: string;
  vatNumber?: string;
}

export interface FamilyTreeModel {
  id: number;
  type: LookupModel;
  nameAr: string;
  nameEn: string;
  location: string;
  vatNumber: string;
  recordActivity: boolean;
  familyTreeUsers: FamilyTreeUserModel[];
}

export interface FamilyTreeUserModel {
  id: number;
  familyTreeId: number;
  familyTreeNameAr: string;
  familyTreeNameEn: string;
  userId: number;
  userFirstName: string;
  userLastName: string;
  userEmail: string;
  type: LookupModel;
  recordActivity: boolean;
  added: boolean; // only for warehouse user management
}

export interface EditFamilyTreeModel {
  id: number;
  nameAr: string;
  nameEn: string;
  location: string;
  vatNumber?: string;
}

export interface AddUserModel {
  id: number;
  userEmail: string;
  familyTreeUserType: string;
}

export interface RemoveUserModel {
  id: number;
  userId: number;
}

export interface FindSuitableUserModel {
  familyTreeId: number;
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
