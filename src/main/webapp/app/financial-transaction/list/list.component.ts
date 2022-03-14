import { Component, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { AccountService } from 'app/core/auth/account.service';
import { ToastService } from 'app/core/util/toast.service';
import { ConfirmModalComponent } from 'app/shared/components/confirm-modal/confirm-modal.component';
import { LanguageService } from 'app/shared/language/language.service';
import { LookupEnum } from 'app/shared/lookup/lookup.enum';
import { LookupCategoryModel, LookupModel } from 'app/shared/models/lookup.model';
import { first } from 'rxjs/operators';
import { DeleteFinancialTransactionModel, AddFinancialTransactionModel } from '../models/financial-transaction.model';
import { ListFinancialTransactionService } from './list.service';
import { NgbdSortableHeaderDirective, SortEvent } from './sortable.directive';

@Component({
  selector: 'jhi-list-financial-transaction',
  templateUrl: './list.component.html',
})
export class ListFinancialTransactionComponent implements OnInit {
  @ViewChild('confirmDeleteModal') confirmDeleteModal?: ConfirmModalComponent;
  @ViewChildren(NgbdSortableHeaderDirective) headers?: QueryList<NgbdSortableHeaderDirective>;
  faTrashAlt = faTrashAlt;

  form = this.fb.group({
    amount: [null, [Validators.required]],
    specificType: [null, [Validators.required]],
    description: [null, [Validators.minLength(1), Validators.maxLength(255)]],
  });

  currentLanguage = this.languageService.onLangChange();
  deleting = false;
  adding = false;

  farm = this.accountService.selectedFarm;

  @Input() type = 'EXPENSE';

  incomeTypes?: LookupModel[];
  expenseTypes?: LookupModel[];

  constructor(
    private fb: FormBuilder,
    public service: ListFinancialTransactionService,
    private languageService: LanguageService,
    private toastService: ToastService,
    private router: Router,
    private accountService: AccountService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(paramMap => {
      const typeParam = paramMap.get('type');

      if (typeParam && typeParam === 'INCOME') {
        this.type = typeParam;
      }

      if (this.farm != null && this.farm.type.code === 'MAIN') {
        this.service.type = this.type;
        this.service.farmId = this.farm.farmId;
      } else {
        this.router.navigate(['/']);
      }
    });

    this.route.data.pipe(first()).subscribe(data => {
      if (data.lookups?.find((x: LookupCategoryModel) => x.lookupName === LookupEnum.IncomeType)) {
        this.incomeTypes = data.lookups.find((x: LookupCategoryModel) => x.lookupName === LookupEnum.IncomeType).lookupList;
      }

      if (data.lookups?.find((x: LookupCategoryModel) => x.lookupName === LookupEnum.ExpenseType)) {
        this.expenseTypes = data.lookups.find((x: LookupCategoryModel) => x.lookupName === LookupEnum.ExpenseType).lookupList;
      }
    });
  }

  add(): void {
    if (this.form.valid) {
      this.adding = true;

      this.service.add(this.createAddModel()).subscribe(
        () => {
          this.adding = false;
          this.toastService.success('global.message.successfullyAdded');
          this.service.load();
          this.form.reset();
        },
        error => {
          this.service.errorHandler(error);
          this.adding = false;
        }
      );
    } else {
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key)?.markAsTouched();
      });
    }
  }

  delete(id: number): void {
    this.deleting = true;
    this.confirmDeleteModal?.open(id);
  }

  confirmed(id: number): void {
    this.service.delete(this.createDeleteModel(id)).subscribe(
      () => {
        this.service.load();
        this.deleting = false;
        this.toastService.success('global.message.successfullyRemoved');
      },
      error => {
        this.service.errorHandler(error);
        this.deleting = false;
      }
    );
  }

  createDeleteModel(id: number): DeleteFinancialTransactionModel {
    if (this.farm != null) {
      const data: DeleteFinancialTransactionModel = {
        farmId: this.farm.farmId,
        financialTransactionId: id,
      };

      return data;
    } else {
      return {} as DeleteFinancialTransactionModel;
    }
  }

  createAddModel(): AddFinancialTransactionModel {
    if (this.farm != null) {
      const data: AddFinancialTransactionModel = {
        farmId: this.farm.farmId,
        type: this.type,
        amount: this.type === 'EXPENSE' ? '-' + String(this.form.get('amount')?.value) : this.form.get('amount')?.value,
        description: this.form.get('description')?.value,
        specificType: this.form.get('specificType')?.value.code,
      };

      return data;
    } else {
      return {} as AddFinancialTransactionModel;
    }
  }

  onSort({ column, direction }: SortEvent): void {
    // resetting other headers
    this.headers?.forEach(header => {
      if (header.jhiSortable !== column) {
        header.direction = '';
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }
}
