import { Route } from '@angular/router';
import { Authority } from 'app/config/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { LookupResolver } from 'app/shared/lookup/lookup.resolver';
import { AddFarmComponent } from './add/add.component';
import { LookupEnum } from 'app/shared/lookup/lookup.enum';
import { EditFarmComponent } from './edit/edit.component';
import { FarmResolver } from './farm-management.resolver';
import { EditFarmUserComponent } from './edit-user/edit-farm-user.component';
import { ListOwnedFarmComponent } from './list-owned/list-owned.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { SubscriptionComponent } from './subscription/list/subscription.component';
import { AddSubscriptionComponent } from './subscription/add/add.component';
import { UpgradeSubscriptionComponent } from './subscription/upgrade/upgrade.component';
import { ViewSubscriptionResolver } from './subscription/view/view.resolver';
import { ViewSubscriptionComponent } from './subscription/view/view.component';
import { RenewSubscriptionComponent } from './subscription/renew/renew.component';
import { RenewSubscriptionResolver } from './subscription/renew/renew.resolver';

export const farmRoutes: Route[] = [
  {
    path: '',
    component: ListOwnedFarmComponent,
    canActivate: [UserRouteAccessService],
    data: {
      authorities: [Authority.USER],
      lookup: [],
    },
  },
  {
    path: 'add',
    component: AddFarmComponent,
    canActivate: [UserRouteAccessService],
    resolve: {
      lookups: LookupResolver,
    },
    data: {
      authorities: [Authority.USER],
      lookupNames: [LookupEnum.FarmType],
    },
  },
  {
    path: 'edit/:id',
    component: EditFarmComponent,
    canActivate: [UserRouteAccessService],
    resolve: {
      farm: FarmResolver,
    },
    data: {
      authorities: [Authority.USER],
    },
  },
  {
    path: 'edit-user/:id',
    component: EditFarmUserComponent,
    canActivate: [UserRouteAccessService],
    resolve: {
      farm: FarmResolver,
    },
    data: {
      authorities: [Authority.USER],
    },
  },
  {
    path: 'invoice/:farmId',
    component: InvoiceComponent,
    canActivate: [UserRouteAccessService],
    resolve: {
      lookups: LookupResolver,
    },
    data: {
      authorities: [Authority.USER],
      lookupNames: [LookupEnum.InvoiceStatus],
    },
  },
  {
    path: 'subscription/:farmId',
    component: SubscriptionComponent,
    canActivate: [UserRouteAccessService],
    resolve: {
      lookups: LookupResolver,
    },
    data: {
      authorities: [Authority.USER],
      lookupNames: [LookupEnum.SubscriptionStatus],
    },
  },
  {
    path: 'subscription/add/:farmId',
    component: AddSubscriptionComponent,
    canActivate: [UserRouteAccessService],
    data: {
      authorities: [Authority.USER],
    },
  },
  {
    path: 'subscription/upgrade/:farmId/:subscriptionId',
    component: UpgradeSubscriptionComponent,
    canActivate: [UserRouteAccessService],
    data: {
      authorities: [Authority.USER],
    },
  },
  {
    path: 'subscription/view/:farmId/:subscriptionId',
    component: ViewSubscriptionComponent,
    canActivate: [UserRouteAccessService],
    data: {
      authorities: [Authority.USER],
    },
    resolve: {
      subscription: ViewSubscriptionResolver,
    },
  },
  {
    path: 'subscription/renew/:farmId/:subscriptionId',
    component: RenewSubscriptionComponent,
    canActivate: [UserRouteAccessService],
    data: {
      authorities: [Authority.USER],
    },
    resolve: {
      package: RenewSubscriptionResolver,
    },
  },
];
