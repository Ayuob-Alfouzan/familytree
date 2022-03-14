import { Route } from '@angular/router';
import { Authority } from 'app/config/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { LookupResolver } from 'app/shared/lookup/lookup.resolver';
import { LookupEnum } from 'app/shared/lookup/lookup.enum';
import { DashboardResolver } from './dashboard/dashboard.resolver';
import { ListSheepComponent } from './sheep-management/list/list.component';
import { AddSheepComponent } from './sheep-management/add/add.component';
import { ViewSheepComponent } from './sheep-management/view/view.component';
import { ViewSheepResolver } from './sheep-management/view/view.resolver';
import { AddCopulationComponent } from './sheep-management/copulation/add/add.component';
import { UpdateSheepComponent } from './sheep-management/update/update.component';
import { AddGestationComponent } from './sheep-management/gestation/add/add.component';
import { LambedGestationComponent } from './sheep-management/gestation/lambed/lambed.component';
import { ViewGestationResolver } from './sheep-management/gestation/view.resolver';
import { AbortedGestationComponent } from './sheep-management/gestation/aborted/aborted.component';
import { ConfirmedCopulationComponent } from './sheep-management/copulation/confirmed/confirmed.component';
import { ViewCopulationResolver } from './sheep-management/copulation/view.resolver';
import { UpdateGestationComponent } from './sheep-management/gestation/update/update.component';
import { ListSheepVaccinationComponent } from './vaccination-management/list/list.component';
import { AddSheepVaccinationComponent } from './vaccination-management/add/add.component';
import { ViewSheepVaccinationComponent } from './vaccination-management/view/view.component';
import { ViewSheepVaccinationResolver } from './vaccination-management/view/view.resolver';
import { UpdateSheepVaccinationComponent } from './vaccination-management/update/update.component';
import { ViewSheepTreatmentComponent } from './treatment-management/view/view.component';
import { ViewSheepTreatmentResolver } from './treatment-management/view/view.resolver';
import { UpdateSheepTreatmentComponent } from './treatment-management/update/update.component';
import { ListSheepTreatmentComponent } from './treatment-management/list/list.component';
import { AddSheepTreatmentComponent } from './treatment-management/add/add.component';
import { NotPregnantReportComponent } from './report/not-pregnant/not-pregnant.component';

export const farmRoutes: Route[] = [
  {
    path: 'list',
    component: ListSheepComponent,
    canActivate: [UserRouteAccessService],
    data: {
      authorities: [Authority.USER],
      lookupNames: [LookupEnum.SheepCategory, LookupEnum.SheepType, LookupEnum.SheepStatus],
    },
    resolve: {
      lookups: LookupResolver,
      dashboardData: DashboardResolver,
    },
  },
  {
    path: 'add',
    component: AddSheepComponent,
    canActivate: [UserRouteAccessService],
    data: {
      authorities: [Authority.USER],
      lookupNames: [LookupEnum.SheepCategory, LookupEnum.SheepType, LookupEnum.SheepGender],
    },
    resolve: {
      lookups: LookupResolver,
    },
  },
  {
    path: 'update/:sheepId',
    component: UpdateSheepComponent,
    canActivate: [UserRouteAccessService],
    data: {
      authorities: [Authority.USER],
      lookupNames: [LookupEnum.SheepCategory, LookupEnum.SheepType, LookupEnum.SheepGender, LookupEnum.SheepStatus],
    },
    resolve: {
      lookups: LookupResolver,
      item: ViewSheepResolver,
    },
  },
  {
    path: 'view/:sheepId',
    component: ViewSheepComponent,
    canActivate: [UserRouteAccessService],
    data: {
      authorities: [Authority.USER],
      lookupNames: [LookupEnum.GestationStatus],
    },
    resolve: {
      lookups: LookupResolver,
      item: ViewSheepResolver,
    },
  },
  {
    path: 'add-copulation/:sheepId',
    component: AddCopulationComponent,
    canActivate: [UserRouteAccessService],
    data: {
      authorities: [Authority.USER],
    },
    resolve: {
      item: ViewSheepResolver,
    },
  },
  {
    path: 'add-gestation/:sheepId',
    component: AddGestationComponent,
    canActivate: [UserRouteAccessService],
    data: {
      authorities: [Authority.USER],
    },
    resolve: {
      item: ViewSheepResolver,
    },
  },
  {
    path: 'lambed-gestation/:gestationId',
    component: LambedGestationComponent,
    canActivate: [UserRouteAccessService],
    data: {
      authorities: [Authority.USER],
      lookupNames: [LookupEnum.SheepGender],
    },
    resolve: {
      item: ViewGestationResolver,
      lookups: LookupResolver,
    },
  },
  {
    path: 'update-gestation/:gestationId',
    component: UpdateGestationComponent,
    canActivate: [UserRouteAccessService],
    data: {
      authorities: [Authority.USER],
    },
    resolve: {
      item: ViewGestationResolver,
    },
  },
  {
    path: 'aborted-gestation/:gestationId',
    component: AbortedGestationComponent,
    canActivate: [UserRouteAccessService],
    data: {
      authorities: [Authority.USER],
    },
    resolve: {
      item: ViewGestationResolver,
    },
  },
  {
    path: 'confirmed-copulation/:copulationId',
    component: ConfirmedCopulationComponent,
    canActivate: [UserRouteAccessService],
    data: {
      authorities: [Authority.USER],
    },
    resolve: {
      item: ViewCopulationResolver,
    },
  },
  {
    path: 'list-sheep-vaccination',
    component: ListSheepVaccinationComponent,
    canActivate: [UserRouteAccessService],
    data: {
      authorities: [Authority.USER],
      lookupNames: [LookupEnum.SheepVaccinationType],
    },
    resolve: {
      lookups: LookupResolver,
    },
  },
  {
    path: 'add-sheep-vaccination',
    component: AddSheepVaccinationComponent,
    canActivate: [UserRouteAccessService],
    data: {
      authorities: [Authority.USER],
      lookupNames: [LookupEnum.SheepVaccinationType],
    },
    resolve: {
      lookups: LookupResolver,
    },
  },
  {
    path: 'view-sheep-vaccination/:sheepVaccinationId',
    component: ViewSheepVaccinationComponent,
    canActivate: [UserRouteAccessService],
    data: {
      authorities: [Authority.USER],
    },
    resolve: {
      item: ViewSheepVaccinationResolver,
    },
  },
  {
    path: 'update-sheep-vaccination/:sheepVaccinationId',
    component: UpdateSheepVaccinationComponent,
    canActivate: [UserRouteAccessService],
    data: {
      authorities: [Authority.USER],
    },
    resolve: {
      item: ViewSheepVaccinationResolver,
    },
  },
  {
    path: 'list-sheep-treatment',
    component: ListSheepTreatmentComponent,
    canActivate: [UserRouteAccessService],
    data: {
      authorities: [Authority.USER],
      lookupNames: [LookupEnum.SheepTreatmentType],
    },
    resolve: {
      lookups: LookupResolver,
    },
  },
  {
    path: 'add-sheep-treatment',
    component: AddSheepTreatmentComponent,
    canActivate: [UserRouteAccessService],
    data: {
      authorities: [Authority.USER],
      lookupNames: [LookupEnum.SheepTreatmentType, LookupEnum.SheepTreatmentDoseType, LookupEnum.SheepType],
    },
    resolve: {
      lookups: LookupResolver,
    },
  },
  {
    path: 'view-sheep-treatment/:sheepTreatmentId',
    component: ViewSheepTreatmentComponent,
    canActivate: [UserRouteAccessService],
    data: {
      authorities: [Authority.USER],
    },
    resolve: {
      item: ViewSheepTreatmentResolver,
    },
  },
  {
    path: 'update-sheep-treatment/:sheepTreatmentId',
    component: UpdateSheepTreatmentComponent,
    canActivate: [UserRouteAccessService],
    data: {
      authorities: [Authority.USER],
      lookupNames: [LookupEnum.SheepTreatmentType, LookupEnum.SheepTreatmentDoseType, LookupEnum.SheepType],
    },
    resolve: {
      item: ViewSheepTreatmentResolver,
      lookups: LookupResolver,
    },
  },
  {
    path: 'not-pregnant-report',
    component: NotPregnantReportComponent,
    canActivate: [UserRouteAccessService],
    data: {
      authorities: [Authority.USER],
    },
  },
];
