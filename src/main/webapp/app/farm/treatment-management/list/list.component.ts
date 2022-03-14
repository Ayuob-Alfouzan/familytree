import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { AccountService } from 'app/core/auth/account.service';
import { ToastService } from 'app/core/util/toast.service';
import { ConfirmModalComponent } from 'app/shared/components/confirm-modal/confirm-modal.component';
import { ListTreatmentService } from './list.service';
import { NgbdSortableHeaderDirective, SortEvent } from '../../sortable.directive';
import { first } from 'rxjs/operators';
import { LookupCategoryModel } from 'app/shared/models/lookup.model';
import { LookupEnum } from 'app/shared/lookup/lookup.enum';
import { DeleteTreatmentModel } from 'app/familyTree/models/treatment.model';
import { LanguageService } from 'app/shared/language/language.service';

@Component({
  selector: 'jhi-list-treatment',
  templateUrl: './list.component.html',
})
export class ListTreatmentComponent implements OnInit {
  @ViewChild('confirmDeleteModal') confirmDeleteModal?: ConfirmModalComponent;
  @ViewChildren(NgbdSortableHeaderDirective) headers?: QueryList<NgbdSortableHeaderDirective>;
  faTrashAlt = faTrashAlt;

  currentLanguage = this.languageService.onLangChange();
  deleting = false;
  updating = false;

  familyTree = this.accountService.selectedFarm;
  isMain = false;

  treatmentTypes = [];

  constructor(
    public service: ListTreatmentService,
    private languageService: LanguageService,
    private toastService: ToastService,
    private router: Router,
    private accountService: AccountService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(first()).subscribe(paramMap => {
      const warehouseId = paramMap.get('warehouseId');

      if (this.familyTree != null && warehouseId != null) {
        if (this.service.warehouseId && this.service.warehouseId !== +warehouseId) {
          this.service.resetDefauleState();
        }
        this.service.warehouseId = +warehouseId;

        if (this.familyTree.type.code === 'MAIN') {
          this.isMain = true;
        }
      } else {
        this.router.navigate(['/']);
      }
    });

    this.route.data.pipe(first()).subscribe(data => {
      if (data.lookups?.find((x: LookupCategoryModel) => x.lookupName === LookupEnum.TreatmentType)) {
        this.treatmentTypes = data.lookups.find((x: LookupCategoryModel) => x.lookupName === LookupEnum.TreatmentType).lookupList;
      }
    });
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

  createDeleteModel(id: number): DeleteTreatmentModel {
    if (this.familyTree != null) {
      const data: DeleteTreatmentModel = {
        warehouseId: this.service.warehouseId,
        treatmentId: id,
      };

      return data;
    } else {
      return {} as DeleteTreatmentModel;
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
