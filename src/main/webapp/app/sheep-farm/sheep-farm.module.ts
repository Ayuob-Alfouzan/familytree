import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { farmRoutes } from './sheep-familyTree.route';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { FarmResolver } from './sheep-familyTree.resolver';
import { NgbdSortableHeaderDirective } from './sortable.directive';
import { DashboardResolver } from './dashboard/dashboard.resolver';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SheepFarmService } from './sheep-familyTree.service';
import { ListSheepComponent } from './sheep-management/list/list.component';
import { ListSheepService } from './sheep-management/list/list.service';
import { AddSheepComponent } from './sheep-management/add/add.component';
import { AddSheepService } from './sheep-management/add/add.service';
import { ViewSheepService } from './sheep-management/view/view.service';
import { ViewSheepComponent } from './sheep-management/view/view.component';
import { ListCopulationService } from './sheep-management/copulation/list/list.service';
import { ListCopulationComponent } from './sheep-management/copulation/list/list.component';
import { ViewSheepResolver } from './sheep-management/view/view.resolver';
import { AddCopulationComponent } from './sheep-management/copulation/add/add.component';
import { AddCopulationService } from './sheep-management/copulation/add/add.service';
import { UpdateSheepComponent } from './sheep-management/update/update.component';
import { UpdateSheepService } from './sheep-management/update/update.service';
import { ListGestationComponent } from './sheep-management/gestation/list/list.component';
import { AddGestationComponent } from './sheep-management/gestation/add/add.component';
import { ListGestationService } from './sheep-management/gestation/list/list.service';
import { AddGestationService } from './sheep-management/gestation/add/add.service';
import { ViewGestationResolver } from './sheep-management/gestation/view.resolver';
import { LambedGestationComponent } from './sheep-management/gestation/lambed/lambed.component';
import { LambedGestationService } from './sheep-management/gestation/lambed/lambed.service';
import { AbortedGestationComponent } from './sheep-management/gestation/aborted/aborted.component';
import { AbortedGestationService } from './sheep-management/gestation/aborted/aborted.service';
import { ViewCopulationResolver } from './sheep-management/copulation/view.resolver';
import { ConfirmedCopulationService } from './sheep-management/copulation/confirmed/confirmed.service';
import { ConfirmedCopulationComponent } from './sheep-management/copulation/confirmed/confirmed.component';
import { ListSheepChildrenComponent } from './sheep-management/list-children/list-children.component';
import { ListSheepChildrenService } from './sheep-management/list-children/list-children.service';
import { UpdateGestationComponent } from './sheep-management/gestation/update/update.component';
import { UpdateGestationService } from './sheep-management/gestation/update/update.service';
import { ListSheepVaccinationComponent } from './vaccination-management/list/list.component';
import { ListSheepVaccinationService } from './vaccination-management/list/list.service';
import { AddSheepVaccinationComponent } from './vaccination-management/add/add.component';
import { AddSheepVaccinationService } from './vaccination-management/add/add.service';
import { ViewSheepVaccinationComponent } from './vaccination-management/view/view.component';
import { ViewSheepVaccinationService } from './vaccination-management/view/view.service';
import { ViewSheepVaccinationResolver } from './vaccination-management/view/view.resolver';
import { UpdateSheepVaccinationService } from './vaccination-management/update/update.service';
import { UpdateSheepVaccinationComponent } from './vaccination-management/update/update.component';
import { ListSheepVaccinationHistoryService } from './vaccination-management/list-history/list-history.service';
import { ListSheepVaccinationHistoryComponent } from './vaccination-management/list-history/list-history.component';
import { UpdateSheepTreatmentComponent } from './treatment-management/update/update.component';
import { ViewSheepTreatmentComponent } from './treatment-management/view/view.component';
import { UpdateSheepTreatmentService } from './treatment-management/update/update.service';
import { ViewSheepTreatmentResolver } from './treatment-management/view/view.resolver';
import { ViewSheepTreatmentService } from './treatment-management/view/view.service';
import { ListSheepTreatmentComponent } from './treatment-management/list/list.component';
import { AddSheepTreatmentComponent } from './treatment-management/add/add.component';
import { ListSheepTreatmentService } from './treatment-management/list/list.service';
import { AddSheepTreatmentService } from './treatment-management/add/add.service';
import { NotPregnantReportComponent } from './report/not-pregnant/not-pregnant.component';
import { NotPregnantReportService } from './report/not-pregnant/not-pregnant.service';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(farmRoutes), NgMultiSelectDropDownModule.forRoot()],
  declarations: [
    NgbdSortableHeaderDirective,
    ListSheepComponent,
    DashboardComponent,
    AddSheepComponent,
    ViewSheepComponent,
    ListCopulationComponent,
    AddCopulationComponent,
    UpdateSheepComponent,
    ListGestationComponent,
    AddGestationComponent,
    LambedGestationComponent,
    AbortedGestationComponent,
    ConfirmedCopulationComponent,
    ListSheepChildrenComponent,
    UpdateGestationComponent,
    ListSheepVaccinationComponent,
    AddSheepVaccinationComponent,
    ViewSheepVaccinationComponent,
    UpdateSheepVaccinationComponent,
    ListSheepVaccinationHistoryComponent,
    ListSheepTreatmentComponent,
    AddSheepTreatmentComponent,
    ViewSheepTreatmentComponent,
    UpdateSheepTreatmentComponent,
    NotPregnantReportComponent,
  ],
  providers: [
    FarmResolver,
    DashboardResolver,
    SheepFarmService,
    ListSheepService,
    AddSheepService,
    ViewSheepService,
    ListCopulationService,
    ViewSheepResolver,
    AddCopulationService,
    UpdateSheepService,
    ListGestationService,
    AddGestationService,
    ViewGestationResolver,
    LambedGestationService,
    AbortedGestationService,
    ViewCopulationResolver,
    ConfirmedCopulationService,
    ListSheepChildrenService,
    UpdateGestationService,
    ListSheepVaccinationService,
    AddSheepVaccinationService,
    ViewSheepVaccinationService,
    ViewSheepVaccinationResolver,
    UpdateSheepVaccinationService,
    ListSheepVaccinationHistoryService,
    ListSheepTreatmentService,
    AddSheepTreatmentService,
    ViewSheepTreatmentService,
    ViewSheepTreatmentResolver,
    UpdateSheepTreatmentService,
    NotPregnantReportService,
  ],
})
export class SheepFarmModule {}
