import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faTrashAlt, faKiwiBird, faEgg, faEye } from '@fortawesome/free-solid-svg-icons';
import { AccountService } from 'app/core/auth/account.service';
import { ToastService } from 'app/core/util/toast.service';
import { ConfirmModalComponent } from 'app/shared/components/confirm-modal/confirm-modal.component';
import { AddCoopModel, ChangeCoopStatusModel, DeleteCoopModel } from '../../models/coop.model';
import { ListCoopService } from './list.service';
import { NgbdSortableHeaderDirective, SortEvent } from '../../sortable.directive';
import { first } from 'rxjs/operators';
import { LookupCategoryModel, LookupModel } from 'app/shared/models/lookup.model';
import { LookupEnum } from 'app/shared/lookup/lookup.enum';
import { WarehouseDashboardModel } from 'app/farm/models/warehouse.model';
import { LanguageService } from 'app/shared/language/language.service';

@Component({
  selector: 'jhi-list-coop',
  templateUrl: './list.component.html',
})
export class ListCoopComponent implements OnInit {
  @ViewChild('confirmDeleteModal') confirmDeleteModal?: ConfirmModalComponent;
  @ViewChildren(NgbdSortableHeaderDirective) headers?: QueryList<NgbdSortableHeaderDirective>;
  faTrashAlt = faTrashAlt;
  faKiwiBird = faKiwiBird;
  faEye = faEye;
  faEgg = faEgg;
  isCollapsed = window.innerWidth < 400 || false;

  form = this.fb.group({
    name: [null, [Validators.required, Validators.max(20)]],
  });

  currentLanguage = this.languageService.onLangChange();
  deleting = false;
  adding = false;
  updating = false;

  farm = this.accountService.selectedFarm;
  isMain = false;

  pigeonStatuses = [];

  dashboardData?: WarehouseDashboardModel;

  constructor(
    private fb: FormBuilder,
    public service: ListCoopService,
    private languageService: LanguageService,
    private toastService: ToastService,
    private router: Router,
    private accountService: AccountService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(first()).subscribe(paramMap => {
      const warehouseId = paramMap.get('warehouseId');

      if (this.farm != null && warehouseId != null) {
        if (this.service.warehouseId && this.service.warehouseId !== +warehouseId) {
          this.service.resetDefauleState();
        }
        this.service.warehouseId = +warehouseId;

        if (this.farm.type.code === 'MAIN') {
          this.isMain = true;
        }
      } else {
        this.router.navigate(['/']);
      }
    });

    this.route.data.pipe(first()).subscribe(data => {
      if (data.lookups?.find((x: LookupCategoryModel) => x.lookupName === LookupEnum.PigeonStatus)) {
        this.pigeonStatuses = data.lookups.find((x: LookupCategoryModel) => x.lookupName === LookupEnum.PigeonStatus).lookupList;
      }

      this.dashboardData = data.dashboardData;
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

  changeMaleStatus(id: number, item: LookupModel): void {
    this.changeStatus(id, true, item.code);
  }

  changeFemaleStatus(id: number, item: LookupModel): void {
    this.changeStatus(id, false, item.code);
  }

  changeStatus(id: number, isMale: boolean, newStatus: string): void {
    this.updating = true;

    this.service.changeStatus(this.createChangeStatusModel(id, isMale, newStatus)).subscribe(
      () => {
        this.service.load();
        this.updating = false;
        this.toastService.success('global.message.successfullyUpdated');
      },
      error => {
        this.service.errorHandler(error);
        this.updating = false;
      }
    );
  }

  createDeleteModel(id: number): DeleteCoopModel {
    if (this.farm != null) {
      const data: DeleteCoopModel = {
        warehouseId: this.service.warehouseId,
        coopId: id,
      };

      return data;
    } else {
      return {} as DeleteCoopModel;
    }
  }

  createChangeStatusModel(id: number, isMale: boolean, newStatus: string): ChangeCoopStatusModel {
    if (this.farm != null) {
      const data: ChangeCoopStatusModel = {
        warehouseId: this.service.warehouseId,
        coopId: id,
        isMale,
        newStatus,
      };

      return data;
    } else {
      return {} as ChangeCoopStatusModel;
    }
  }

  createAddModel(): AddCoopModel {
    if (this.farm != null) {
      const data: AddCoopModel = {
        warehouseId: this.service.warehouseId,
        name: this.form.get('name')?.value,
      };

      return data;
    } else {
      return {} as AddCoopModel;
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

  toggleDashboard(): void {
    this.isCollapsed = !this.isCollapsed;
  }
}
