import { Route } from '@angular/router';
import { Authority } from 'app/config/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { LookupResolver } from 'app/shared/lookup/lookup.resolver';
import { AddFamilyTreeComponent } from './add/add.component';
import { LookupEnum } from 'app/shared/lookup/lookup.enum';
import { EditFamilyTreeComponent } from './edit/edit.component';
import { FamilyTreeResolver } from './family-tree-management.resolver';
import { EditFamilyTreeUserComponent } from './edit-user/edit-family-tree-user.component';
import { ListOwnedFamilyTreeComponent } from './list-owned/list-owned.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { SubscriptionComponent } from './subscription/list/subscription.component';
import { AddSubscriptionComponent } from './subscription/add/add.component';
import { UpgradeSubscriptionComponent } from './subscription/upgrade/upgrade.component';
import { ViewSubscriptionResolver } from './subscription/view/view.resolver';
import { ViewSubscriptionComponent } from './subscription/view/view.component';
import { RenewSubscriptionComponent } from './subscription/renew/renew.component';
import { RenewSubscriptionResolver } from './subscription/renew/renew.resolver';
import { TokenComponent } from './token/token.component';

export const familyTreeRoutes: Route[] = [
  {
    path: '',
    component: ListOwnedFamilyTreeComponent,
    canActivate: [UserRouteAccessService],
    data: {
      authorities: [Authority.USER],
    },
  },
  {
    path: 'add',
    component: AddFamilyTreeComponent,
    canActivate: [UserRouteAccessService],
    resolve: {
      lookups: LookupResolver,
    },
    data: {
      authorities: [Authority.USER],
      lookupNames: [LookupEnum.FamilyTreeType],
    },
  },
  {
    path: 'edit/:id',
    component: EditFamilyTreeComponent,
    canActivate: [UserRouteAccessService],
    resolve: {
      familyTree: FamilyTreeResolver,
    },
    data: {
      authorities: [Authority.USER],
    },
  },
  {
    path: 'edit-user/:id',
    component: EditFamilyTreeUserComponent,
    canActivate: [UserRouteAccessService],
    resolve: {
      familyTree: FamilyTreeResolver,
    },
    data: {
      authorities: [Authority.USER],
    },
  },
  {
    path: 'invoice/:familyTreeId',
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
    path: 'token/:familyTreeId',
    component: TokenComponent,
    canActivate: [UserRouteAccessService],
    data: {
      authorities: [Authority.USER],
    },
  },
  {
    path: 'subscription/:familyTreeId',
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
    path: 'subscription/add/:familyTreeId',
    component: AddSubscriptionComponent,
    canActivate: [UserRouteAccessService],
    data: {
      authorities: [Authority.USER],
    },
  },
  {
    path: 'subscription/upgrade/:familyTreeId/:subscriptionId',
    component: UpgradeSubscriptionComponent,
    canActivate: [UserRouteAccessService],
    data: {
      authorities: [Authority.USER],
    },
  },
  {
    path: 'subscription/view/:familyTreeId/:subscriptionId',
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
    path: 'subscription/renew/:familyTreeId/:subscriptionId',
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
