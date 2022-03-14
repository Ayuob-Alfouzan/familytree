import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { AddFamilyTreeComponent } from './add/add.component';
import { AddFamilyTreeService } from './add/add.service';
import { familyTreeRoutes } from './family-tree-management.route';
import { ListFamilyTreeComponent } from './list/list.component';
import { ListFamilyTreeService } from './list/list.service';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { EditFamilyTreeComponent } from './edit/edit.component';
import { EditFamilyTreeService } from './edit/edit.service';
import { FamilyTreeResolver } from './family-tree-management.resolver';
import { EditFamilyTreeUserComponent } from './edit-user/edit-family-tree-user.component';
import { EditFamilyTreeUserService } from './edit-user/edit-family-tree-user.service';
import { NgbdSortableHeaderDirective } from './sortable.directive';
import { FamilyTreeManagementService } from './family-tree-management.service';
import { ListOwnedFamilyTreeComponent } from './list-owned/list-owned.component';
import { ListOwnedFamilyTreeService } from './list-owned/list-owned.service';
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
  imports: [SharedModule, RouterModule.forChild(familyTreeRoutes), NgMultiSelectDropDownModule.forRoot()],
  declarations: [
    ListFamilyTreeComponent,
    AddFamilyTreeComponent,
    EditFamilyTreeComponent,
    EditFamilyTreeUserComponent,
    NgbdSortableHeaderDirective,
    ListOwnedFamilyTreeComponent,
    InvoiceComponent,
    SubscriptionComponent,
    AddSubscriptionComponent,
    UpgradeSubscriptionComponent,
    ViewSubscriptionComponent,
    RenewSubscriptionComponent,
  ],
  providers: [
    ListFamilyTreeService,
    AddFamilyTreeService,
    EditFamilyTreeService,
    FamilyTreeResolver,
    EditFamilyTreeUserService,
    FamilyTreeManagementService,
    ListOwnedFamilyTreeService,
    InvoiceService,
    SubscriptionService,
    ViewSubscriptionResolver,
    RenewSubscriptionResolver,
  ],
})
export class FamilyTreeManagementModule {}
