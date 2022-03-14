import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { farmRoutes } from './familyTree.route';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { FarmResolver } from './familyTree.resolver';
import { NgbdSortableHeaderDirective } from './sortable.directive';
import { ListWarehouseComponent } from './warehouse-management/list/list.component';
import { ListWarehouseService } from './warehouse-management/list/list.service';
import { WarehouseResolver } from './warehouse-management/warehouse.resolver';
import { EditWarehouseService } from './warehouse-management/edit/edit-warehouse.service';
import { EditWarehouseComponent } from './warehouse-management/edit/edit-warehouse.component';
import { DashboardResolver } from './dashboard/dashboard.resolver';
import { FarmService } from './familyTree.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ListCoopComponent } from './coop-management/list/list.component';
import { ListCoopService } from './coop-management/list/list.service';
import { ListEggComponent } from './egg-management/list/list.component';
import { ListEggService } from './egg-management/list/list.service';
import { ListChickComponent } from './chick-management/list/list.component';
import { ListChickService } from './chick-management/list/list.service';
import { WarehouseDashboardResolver } from './warehouse-management/warehouse-dashboard.resolver';
import { AddTreatmentComponent } from './treatment-management/add/add.component';
import { ListTreatmentComponent } from './treatment-management/list/list.component';
import { AddTreatmentService } from './treatment-management/add/add.service';
import { ListTreatmentService } from './treatment-management/list/list.service';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(farmRoutes), NgMultiSelectDropDownModule.forRoot()],
  declarations: [
    NgbdSortableHeaderDirective,
    ListWarehouseComponent,
    EditWarehouseComponent,
    DashboardComponent,
    ListCoopComponent,
    ListEggComponent,
    ListChickComponent,
    AddTreatmentComponent,
    ListTreatmentComponent,
  ],
  providers: [
    WarehouseResolver,
    EditWarehouseService,
    FarmResolver,
    ListWarehouseService,
    DashboardResolver,
    FarmService,
    ListCoopService,
    ListEggService,
    ListChickService,
    WarehouseDashboardResolver,
    AddTreatmentService,
    ListTreatmentService,
  ],
})
export class FarmModule {}
