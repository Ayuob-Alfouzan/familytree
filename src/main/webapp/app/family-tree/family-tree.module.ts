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

@NgModule({
  imports: [SharedModule, RouterModule.forChild(familyTreeRoutes), NgMultiSelectDropDownModule.forRoot()],
  declarations: [NgbdSortableHeaderDirective, ViewFamilyTreeComponent],
  providers: [FamilyTreeService, FamilyTreeResolver, ViewFamilyTreeService],
})
export class FamilyTreeModule {}
