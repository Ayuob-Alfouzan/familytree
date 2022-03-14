import { Route } from '@angular/router';
import { Authority } from 'app/config/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { LookupEnum } from 'app/shared/lookup/lookup.enum';
import { LookupResolver } from 'app/shared/lookup/lookup.resolver';
import { ListFinancialTransactionComponent } from './list/list.component';

export const financialTransactionRoutes: Route[] = [
  {
    path: ':type',
    component: ListFinancialTransactionComponent,
    canActivate: [UserRouteAccessService],
    data: {
      authorities: [Authority.USER],
      lookupNames: [LookupEnum.IncomeType, LookupEnum.ExpenseType],
    },
    resolve: {
      lookups: LookupResolver,
    },
  },
];
