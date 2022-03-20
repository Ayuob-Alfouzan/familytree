import { Route } from '@angular/router';
import { Authority } from 'app/config/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ViewFamilyTreeComponent } from './view/view.component';
import { FamilyTreeResolver } from './family-tree.resolver';
import { LookupEnum } from 'app/shared/lookup/lookup.enum';
import { LookupResolver } from 'app/shared/lookup/lookup.resolver';

export const familyTreeRoutes: Route[] = [
  {
    path: '',
    component: ViewFamilyTreeComponent,
    canActivate: [UserRouteAccessService],
    data: {
      authorities: [Authority.USER],
      lookupNames: [LookupEnum.LifeStatus, LookupEnum.Gender],
    },
    resolve: {
      data: FamilyTreeResolver,
      lookups: LookupResolver,
    },
  },
  {
    path: 'view-anon/:token',
    component: ViewFamilyTreeComponent,
    data: {
      view: 'ANON',
    },
    resolve: {
      data: FamilyTreeResolver,
    },
  },
];
