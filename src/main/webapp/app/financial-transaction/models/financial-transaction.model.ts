import { LongFilter, StringFilter, DateRangeFilter } from 'app/shared/models/criteria.model';
import { LookupModel } from 'app/shared/models/lookup.model';

export interface FinancialTransactionModel {
  id: number;
  type: LookupModel;
  specificType: LookupModel;
  amount: number;
  description: string;
  recordActivity: boolean;
  createdDate: Date;
}

export interface AddFinancialTransactionModel {
  farmId: number;
  type: string;
  amount: number;
  description: string;
  specificType: string;
}

export interface DeleteFinancialTransactionModel {
  farmId: number;
  financialTransactionId: number;
}

export interface FinancialTransactionCriteria {
  farmId: LongFilter;
  type: StringFilter;
  createdDate?: DateRangeFilter;
  specificType?: StringFilter;
}
