import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faEdit, faEye, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { AccountService } from 'app/core/auth/account.service';
import { ListSheepService } from './list.service';
import { NgbdSortableHeaderDirective, SortEvent } from '../../sortable.directive';
import { first } from 'rxjs/operators';
import { LookupCategoryModel } from 'app/shared/models/lookup.model';
import { LookupEnum } from 'app/shared/lookup/lookup.enum';
import { LanguageService } from 'app/shared/language/language.service';
import { DashboardModel, DeleteSheepModel, SheepModel } from '../../models/sheep.model';
import { ToastService } from 'app/core/util/toast.service';
import { ConfirmModalComponent } from 'app/shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'jhi-list-sheep',
  templateUrl: './list.component.html',
})
export class ListSheepComponent implements OnInit {
  @ViewChildren(NgbdSortableHeaderDirective) headers?: QueryList<NgbdSortableHeaderDirective>;
  @ViewChild('confirmDeleteModal') confirmDeleteModal?: ConfirmModalComponent;
  faEye = faEye;
  faEdit = faEdit;
  faTrashAlt = faTrashAlt;
  isCollapsed = window.innerWidth < 400 || false;

  currentLanguage = this.languageService.onLangChange();

  farm = this.accountService.selectedFarm;
  isMain = false;

  deleting = false;

  sheepStatuses = [];
  sheepTypes = [];
  sheepCategories = [];

  dashboardData?: DashboardModel;

  constructor(
    public service: ListSheepService,
    private languageService: LanguageService,
    private router: Router,
    private accountService: AccountService,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    if (this.farm != null) {
      if (this.service.farmId && this.service.farmId !== +this.farm.farmId) {
        this.service.resetDefauleState();
      }

      this.service.farmId = +this.farm.farmId;

      if (this.farm.type.code === 'MAIN') {
        this.isMain = true;
      }
    } else {
      this.router.navigate(['/']);
    }

    this.route.data.pipe(first()).subscribe(data => {
      if (data.lookups?.find((x: LookupCategoryModel) => x.lookupName === LookupEnum.SheepType)) {
        this.sheepTypes = data.lookups.find((x: LookupCategoryModel) => x.lookupName === LookupEnum.SheepType).lookupList;
      }

      if (data.lookups?.find((x: LookupCategoryModel) => x.lookupName === LookupEnum.SheepStatus)) {
        this.sheepStatuses = data.lookups.find((x: LookupCategoryModel) => x.lookupName === LookupEnum.SheepStatus).lookupList;
      }

      if (data.lookups?.find((x: LookupCategoryModel) => x.lookupName === LookupEnum.SheepCategory)) {
        this.sheepCategories = data.lookups.find((x: LookupCategoryModel) => x.lookupName === LookupEnum.SheepCategory).lookupList;
      }

      this.dashboardData = data.dashboardData;
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

  createDeleteModel(id: number): DeleteSheepModel {
    if (this.farm != null) {
      const data: DeleteSheepModel = {
        sheepId: id,
      };

      return data;
    } else {
      return {} as DeleteSheepModel;
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

  view(item: SheepModel): void {
    this.service.viewed = item;
    this.router.navigate(['/', 'sheep-farm', 'view', item.id]);
  }

  update(item: SheepModel): void {
    this.service.viewed = item;
    this.router.navigate(['/', 'sheep-farm', 'update', item.id]);
  }
}
