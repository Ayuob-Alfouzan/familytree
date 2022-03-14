import { LongFilter } from 'app/shared/models/criteria.model';

export interface WarehouseModel {
  id: number;
  farmId: number;
  number: number;
  recordActivity: boolean;
}

export interface FullWarehouseModel {
  id: number;
  farmId: number;
  number: number;
  recordActivity: boolean;
  warehouseUsers: WarehouseUserModel[];
}

export interface WarehouseUserModel {
  id: number;
  userId: number;
  userFirstName: string;
  userLastName: string;
  userEmail: string;
  recordActivity: boolean;
}

export interface WarehouseCriteria {
  farmId: LongFilter;
  number?: LongFilter;
}

export interface AddWarehouseModel {
  farmId: number;
  number: number;
}

export interface EditWarehouseModel {
  farmId: number;
  warehouseId: number;
  number: number;
}

export interface DeleteWarehouseModel {
  farmId: number;
  warehouseId: number;
}

export interface GetWarehouseModel {
  farmId: number;
  warehouseId: number;
}

export interface ManageWarehouseUserModel {
  farmId: number;
  warehouseId: number;
  userId: number;
}

export interface WarehouseDashboardRequestModel {
  farmId: number;
  warehouseId: number;
}

export interface WarehouseDashboardModel {
  numberOfCoops: number;
  numberOfEggs: number;
  numberOfChicks: number;
  numberOfTreatments: number;
}
