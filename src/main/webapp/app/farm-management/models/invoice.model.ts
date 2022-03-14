import { DateRangeFilter, LongFilter, StringFilter } from 'app/shared/models/criteria.model';
import { LookupModel } from 'app/shared/models/lookup.model';

export interface InvoiceModel {
  id: number;
  farmId: number;
  status: LookupModel;
  invoiceNumber: number;
  amount: number;
  amountVat: number;
  vatPercentage: number;
  creationDate: Date;
  paymentDate: Date;
  customerName: string;
  recordActivity: boolean;
  subscriptionId: number;
}

export interface InvoiceCriteria {
  farmId: LongFilter;
  statusCode?: StringFilter;
  invoiceNumber?: LongFilter;
  creationDate?: DateRangeFilter;
}
