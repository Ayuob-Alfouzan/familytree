import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { AddFarmComponent } from './add/add.component';
import { AddFarmService } from './add/add.service';
import { farmRoutes } from './familyTree-management.route';
import { ListFarmComponent } from './list/list.component';
import { ListFarmService } from './list/list.service';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { EditFarmComponent } from './edit/edit.component';
import { EditFarmService } from './edit/edit.service';
import { FarmResolver } from './familyTree-management.resolver';
import { EditFarmUserComponent } from './edit-user/edit-familyTree-user.component';
import { EditFarmUserService } from './edit-user/edit-familyTree-user.service';
import { NgbdSortableHeaderDirective } from './sortable.directive';
import { FarmManagementService } from './familyTree-management.service';
import { ListOwnedFarmComponent } from './list-owned/list-owned.component';
import { ListOwnedFarmService } from './list-owned/list-owned.service';
import { InvoiceComponent } from './invoice/invoice.component';
import { InvoiceService } from './invoice/invoice.service';
import { SubscriptionService } from './subscription/subscription.service';
import { SubscriptionComponent } from './subscription/list/subscription.component';
import { AddSubscriptionComponent } from './subscription/add/add.component';
import { UpgradeSubscriptionComponent } from './subscription/upgrade/upgrade.component';
import { ViewSubscriptionResolver } from './subscription/view/view.resolver';
import { ViewSubscriptionComponent } from './subscription/view/view.component';
import { RenewSubscriptionResolver } from './subscription/renew/renew.resolver';
import { RenewSubscriptionComponent } from './subscription/renew/renew.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(farmRoutes), NgMultiSelectDropDownModule.forRoot()],
  declarations: [
    ListFarmComponent,
    AddFarmComponent,
    EditFarmComponent,
    EditFarmUserComponent,
    NgbdSortableHeaderDirective,
    ListOwnedFarmComponent,
    InvoiceComponent,
    SubscriptionComponent,
    AddSubscriptionComponent,
    UpgradeSubscriptionComponent,
    ViewSubscriptionComponent,
    RenewSubscriptionComponent,
  ],
  providers: [
    ListFarmService,
    AddFarmService,
    EditFarmService,
    FarmResolver,
    EditFarmUserService,
    FarmManagementService,
    ListOwnedFarmService,
    InvoiceService,
    SubscriptionService,
    ViewSubscriptionResolver,
    RenewSubscriptionResolver,
  ],
})
export class FarmManagementModule {}
