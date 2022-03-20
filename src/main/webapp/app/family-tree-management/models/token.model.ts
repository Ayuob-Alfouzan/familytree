import { LongFilter, StringFilter } from 'app/shared/models/criteria.model';

export interface TokenModel {
  id: number;
  familyTreeId: number;
  userId: number;
  token: string;
  url: string;
  recordActivity: boolean;
}

export interface TokenCriteria {
  familyTreeId: LongFilter;
  token?: StringFilter;
}

export interface AddTokenModel {
  familyTreeId: number;
}

export interface DeleteTokenModel {
  familyTreeId: number;
  id: number;
}
