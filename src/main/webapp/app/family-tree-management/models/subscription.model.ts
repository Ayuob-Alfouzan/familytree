import { LongFilter, StringFilter } from 'app/shared/models/criteria.model';
import { LookupModel } from 'app/shared/models/lookup.model';
import { InvoiceModel } from './invoice.model';

export interface SubscriptionModel {
  id: number;
  familyTreeId: number;
  invoiceId: number;
  invoice: InvoiceModel;
  status: LookupModel;
  packageDTO: PackageModel;
  startDate: Date;
  endDate: Date;
  rangeStart: number;
  rangeEnd: number;
  recordActivity: boolean;
  subscriptionUpgradeRequests: SubscriptionUpgradeRequestModel[];
}

export interface SubscriptionUpgradeRequestModel {
  id: number;
  familyTreeId: number;
  invoice: InvoiceModel;
  status: LookupModel;
  packageDTO: PackageModel;
  createdDate: Date;
}

export interface SubscriptionCriteria {
  familyTreeId: LongFilter;
  statusCode?: StringFilter;
}

export interface PackageModel {
  id: number;
  familyTreeType: LookupModel;
  nameAr: string;
  nameEn: string;
  nameUr: string;
  descriptionAr: string;
  descriptionEn: string;
  descriptionUr: string;
  rangeStart: number;
  rangeEnd: number;
  cost: number;
  duration: number;
  recordActivity: boolean;
}

export interface SubscriptionActionModel {
  canSubscribe: boolean;
  canRenew: boolean;
  renewSubscriptionId: number;
}
