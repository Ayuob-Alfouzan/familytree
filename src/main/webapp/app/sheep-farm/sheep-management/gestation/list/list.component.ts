import { Component, Input, OnChanges, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons';
import { AccountService } from 'app/core/auth/account.service';
import { ListGestationService } from './list.service';
import { NgbdSortableHeaderDirective, SortEvent } from '../../../sortable.directive';
import { LanguageService } from 'app/shared/language/language.service';
import { SheepModel } from '../../../models/sheep.model';
import { ConfirmModalComponent } from 'app/shared/components/confirm-modal/confirm-modal.component';
import { DeleteGestationModel } from 'app/sheep-familyTree/models/gestation.model';
import { ToastService } from 'app/core/util/toast.service';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { LookupCategoryModel } from 'app/shared/models/lookup.model';
import { LookupEnum } from 'app/shared/lookup/lookup.enum';

@Component({
  selector: 'jhi-list-gestation',
  templateUrl: './list.component.html',
})
export class ListGestationComponent implements OnInit, OnChanges {
  @Input() parent?: SheepModel;
  @ViewChildren(NgbdSortableHeaderDirective) headers?: QueryList<NgbdSortableHeaderDirective>;
  @ViewChild('confirmDeleteModal') confirmDeleteModal?: ConfirmModalComponent;
  faTrashAlt = faTrashAlt;
  faEdit = faEdit;

  currentLanguage = this.languageService.onLangChange();

  familyTree = this.accountService.selectedFarm;
  isMain = false;

  deleting = false;

  gestationStatuses = [];

  constructor(
    public service: ListGestationService,
    private languageService: LanguageService,
    private accountService: AccountService,
    private toastService: ToastService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.data.pipe(first()).subscribe(data => {
      if (data.lookups?.find((x: LookupCategoryModel) => x.lookupName === LookupEnum.GestationStatus)) {
        this.gestationStatuses = data.lookups.find((x: LookupCategoryModel) => x.lookupName === LookupEnum.GestationStatus).lookupList;
      }
    });
  }

  ngOnChanges(): void {
    if (this.familyTree != null && this.parent != null) {
      if (this.parent.gender.code === 'FEMALE') {
        if (!this.service.eweId || this.service.eweId !== this.parent.id) {
          this.service.resetDefauleState();
        }

        this.service.eweId = this.parent.id;
      } else if (this.parent.gender.code === 'MALE') {
        if (!this.service.ramId || this.service.ramId !== this.parent.id) {
          this.service.resetDefauleState();
        }

        this.service.ramId = this.parent.id;
      }

      this.isMain = this.familyTree.type.code === 'MAIN';
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

  createDeleteModel(gestationId: number): DeleteGestationModel {
    if (this.familyTree != null) {
      const data: DeleteGestationModel = {
        gestationId,
      };

      return data;
    } else {
      return {} as DeleteGestationModel;
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

  refresh(): void {
    this.service.load();
  }
}
