import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgbdSortableHeaderDirective } from './list/sortable.directive';
import { ListFinancialTransactionComponent } from './list/list.component';
import { financialTransactionRoutes } from './financial-transaction.route';
import { ListFinancialTransactionService } from './list/list.service';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(financialTransactionRoutes), NgMultiSelectDropDownModule.forRoot()],
  declarations: [ListFinancialTransactionComponent, NgbdSortableHeaderDirective],
  providers: [ListFinancialTransactionService],
})
export class FinancialTransactionModule {}
