import { Route } from '@angular/router';
import { Authority } from 'app/config/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { LookupResolver } from 'app/shared/lookup/lookup.resolver';
import { LookupEnum } from 'app/shared/lookup/lookup.enum';
import { FarmResolver } from './farm.resolver';
import { ListWarehouseComponent } from './warehouse-management/list/list.component';
import { EditWarehouseComponent } from './warehouse-management/edit/edit-warehouse.component';
import { WarehouseResolver } from './warehouse-management/warehouse.resolver';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardResolver } from './dashboard/dashboard.resolver';
import { ListCoopComponent } from './coop-management/list/list.component';
import { ListEggComponent } from './egg-management/list/list.component';
import { ListChickComponent } from './chick-management/list/list.component';
import { WarehouseDashboardResolver } from './warehouse-management/warehouse-dashboard.resolver';
import { ListTreatmentComponent } from './treatment-management/list/list.component';
import { AddTreatmentComponent } from './treatment-management/add/add.component';

export const farmRoutes: Route[] = [
  {
    path: 'warehouse',
    component: ListWarehouseComponent,
    canActivate: [UserRouteAccessService],
    data: {
      authorities: [Authority.USER],
    },
  },
  {
    path: 'edit-warehouse/:warehouseId',
    component: EditWarehouseComponent,
    canActivate: [UserRouteAccessService],
    data: {
      authorities: [Authority.USER],
    },
    resolve: {
      warehouse: WarehouseResolver,
      farm: FarmResolver,
    },
  },
  {
    path: 'coop/:warehouseId',
    component: ListCoopComponent,
    canActivate: [UserRouteAccessService],
    data: {
      authorities: [Authority.USER],
      lookupNames: [LookupEnum.PigeonStatus],
    },
    resolve: {
      lookups: LookupResolver,
      dashboardData: WarehouseDashboardResolver,
    },
  },
  {
    path: 'egg/:coopId',
    component: ListEggComponent,
    canActivate: [UserRouteAccessService],
    data: {
      authorities: [Authority.USER],
      lookupNames: [LookupEnum.EggStatus],
    },
    resolve: {
      lookups: LookupResolver,
    },
  },
  {
    path: 'chick/:coopId',
    component: ListChickComponent,
    canActivate: [UserRouteAccessService],
    data: {
      authorities: [Authority.USER],
      lookupNames: [LookupEnum.ChickStatus],
    },
    resolve: {
      lookups: LookupResolver,
    },
  },
  {
    path: 'treatment/:warehouseId',
    component: ListTreatmentComponent,
    canActivate: [UserRouteAccessService],
    data: {
      authorities: [Authority.USER],
      lookupNames: [LookupEnum.TreatmentType],
    },
    resolve: {
      lookups: LookupResolver,
      dashboardData: WarehouseDashboardResolver,
    },
  },
  {
    path: 'add-treatment/:warehouseId',
    component: AddTreatmentComponent,
    canActivate: [UserRouteAccessService],
    data: {
      authorities: [Authority.USER],
      lookupNames: [LookupEnum.TreatmentType],
    },
    resolve: {
      lookups: LookupResolver,
      warehouse: WarehouseResolver,
    },
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [UserRouteAccessService],
    data: {
      authorities: [Authority.USER],
    },
    resolve: {
      dashboardData: DashboardResolver,
    },
  },
];
