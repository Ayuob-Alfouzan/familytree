import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faTrashAlt, faEdit, faEye } from '@fortawesome/free-solid-svg-icons';
import { AccountService } from 'app/core/auth/account.service';
import { ToastService } from 'app/core/util/toast.service';
import { ConfirmModalComponent } from 'app/shared/components/confirm-modal/confirm-modal.component';
import { AddWarehouseModel, DeleteWarehouseModel } from '../../models/warehouse.model';
import { ListWarehouseService } from './list.service';
import { NgbdSortableHeaderDirective, SortEvent } from '../../sortable.directive';
import { LanguageService } from 'app/shared/language/language.service';

@Component({
  selector: 'jhi-list-warehouse',
  templateUrl: './list.component.html',
})
export class ListWarehouseComponent implements OnInit {
  @ViewChild('confirmDeleteModal') confirmDeleteModal?: ConfirmModalComponent;
  @ViewChildren(NgbdSortableHeaderDirective) headers?: QueryList<NgbdSortableHeaderDirective>;
  faTrashAlt = faTrashAlt;
  faEdit = faEdit;
  faEye = faEye;

  form = this.fb.group({
    number: [null, [Validators.required]],
  });

  currentLanguage = this.languageService.onLangChange();
  deleting = false;
  adding = false;

  familyTree = this.accountService.selectedFarm;
  isMain = false;

  constructor(
    private fb: FormBuilder,
    public service: ListWarehouseService,
    private languageService: LanguageService,
    private toastService: ToastService,
    private router: Router,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    if (this.familyTree != null) {
      this.service.farmId = this.familyTree.farmId;

      if (this.familyTree.type.code === 'MAIN') {
        this.isMain = true;
      }
    } else {
      this.router.navigate(['/']);
    }
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

  createDeleteModel(id: number): DeleteWarehouseModel {
    if (this.familyTree != null) {
      const data: DeleteWarehouseModel = {
        farmId: this.familyTree.farmId,
        warehouseId: id,
      };

      return data;
    } else {
      return {} as DeleteWarehouseModel;
    }
  }

  createAddModel(): AddWarehouseModel {
    if (this.familyTree != null) {
      const data: AddWarehouseModel = {
        farmId: this.familyTree.farmId,
        number: this.form.get('number')?.value,
      };

      return data;
    } else {
      return {} as AddWarehouseModel;
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
