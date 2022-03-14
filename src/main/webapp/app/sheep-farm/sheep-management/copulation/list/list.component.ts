import { Component, EventEmitter, Input, OnChanges, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { AccountService } from 'app/core/auth/account.service';
import { ListCopulationService } from './list.service';
import { NgbdSortableHeaderDirective, SortEvent } from '../../../sortable.directive';
import { LanguageService } from 'app/shared/language/language.service';
import { SheepModel } from '../../../models/sheep.model';
import { ConfirmModalComponent } from 'app/shared/components/confirm-modal/confirm-modal.component';
import { DeleteCopulationModel, FalseCopulationModel } from 'app/sheep-familyTree/models/copulation.model';
import { ToastService } from 'app/core/util/toast.service';

@Component({
  selector: 'jhi-list-copulation',
  templateUrl: './list.component.html',
})
export class ListCopulationComponent implements OnChanges {
  @Input() parent?: SheepModel;
  @ViewChildren(NgbdSortableHeaderDirective) headers?: QueryList<NgbdSortableHeaderDirective>;
  @ViewChild('confirmDeleteModal') confirmDeleteModal?: ConfirmModalComponent;
  @ViewChild('falseModal') falseModal?: ConfirmModalComponent;
  faTrashAlt = faTrashAlt;
  @Output() updated = new EventEmitter<boolean>();

  currentLanguage = this.languageService.onLangChange();

  familyTree = this.accountService.selectedFarm;
  isMain = false;

  deleting = false;

  constructor(
    public service: ListCopulationService,
    private languageService: LanguageService,
    private accountService: AccountService,
    private toastService: ToastService
  ) {}

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

  falseCopulation(id: number): void {
    this.deleting = true;
    this.falseModal?.open(id);
  }

  falseCopulationConfirmed(id: number): void {
    this.service.false(this.createFalseCopulationModel(id)).subscribe(
      () => {
        this.service.load();
        this.deleting = false;
        this.toastService.success('global.message.successfullyUpdated');
      },
      error => {
        this.service.errorHandler(error);
        this.deleting = false;
      }
    );
  }

  createDeleteModel(copulationId: number): DeleteCopulationModel {
    if (this.familyTree != null) {
      const data: DeleteCopulationModel = {
        copulationId,
      };

      return data;
    } else {
      return {} as DeleteCopulationModel;
    }
  }

  createFalseCopulationModel(copulationId: number): FalseCopulationModel {
    if (this.familyTree != null) {
      const data: FalseCopulationModel = {
        copulationId,
      };

      return data;
    } else {
      return {} as FalseCopulationModel;
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
