import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgbdSortableHeaderDirective } from './sortable.directive';
import { familyTreeRoutes } from './family-tree.route';
import { FamilyTreeService } from './family-tree.service';
import { FamilyTreeResolver } from './family-tree.resolver';
import { ViewFamilyTreeComponent } from './view/view.component';
import { ViewFamilyTreeService } from './view/view.service';
import { ViewPersonComponent } from './view-person/view-person.component';
import { AddPersonComponent } from './add/add.component';
import { AddPersonService } from './add/add.service';
import { ActionComponent } from './action/action.component';
import { UpdatePersonComponent } from './update/update.component';
import { UpdatePersonService } from './update/update.service';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(familyTreeRoutes), NgMultiSelectDropDownModule.forRoot()],
  declarations: [
    NgbdSortableHeaderDirective,
    ViewFamilyTreeComponent,
    ActionComponent,
    ViewPersonComponent,
    AddPersonComponent,
    UpdatePersonComponent,
  ],
  providers: [FamilyTreeService, FamilyTreeResolver, ViewFamilyTreeService, AddPersonService, UpdatePersonService],
})
export class FamilyTreeModule {}
