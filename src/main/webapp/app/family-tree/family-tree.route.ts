import { Route } from '@angular/router';
import { Authority } from 'app/config/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ViewFamilyTreeComponent } from './view/view.component';
import { FamilyTreeResolver } from './family-tree.resolver';

export const familyTreeRoutes: Route[] = [
  {
    path: '',
    component: ViewFamilyTreeComponent,
    canActivate: [UserRouteAccessService],
    data: {
      authorities: [Authority.USER],
    },
    resolve: {
      data: FamilyTreeResolver,
    },
  },
];
