import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons';
import { AccountService } from 'app/core/auth/account.service';
import { ToastService } from 'app/core/util/toast.service';
import { ConfirmModalComponent } from 'app/shared/components/confirm-modal/confirm-modal.component';
import { AddChickModel, ChangeChickStatusModel, DeleteChickModel } from '../../models/chick.model';
import { ListChickService } from './list.service';
import { NgbdSortableHeaderDirective, SortEvent } from '../../sortable.directive';
import { first } from 'rxjs/operators';
import { LookupCategoryModel, LookupModel } from 'app/shared/models/lookup.model';
import { LookupEnum } from 'app/shared/lookup/lookup.enum';
import * as dayjs from 'dayjs';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { LanguageService } from 'app/shared/language/language.service';

@Component({
  selector: 'jhi-list-chick',
  templateUrl: './list.component.html',
})
export class ListChickComponent implements OnInit {
  @ViewChild('confirmDeleteModal') confirmDeleteModal?: ConfirmModalComponent;
  @ViewChildren(NgbdSortableHeaderDirective) headers?: QueryList<NgbdSortableHeaderDirective>;
  faTrashAlt = faTrashAlt;
  faEdit = faEdit;

  todayDate: NgbDateStruct = this.calendar.getToday();

  form = this.fb.group({
    hatchingDate: [dayjs().startOf('day'), [Validators.required]],
  });

  currentLanguage = this.languageService.onLangChange();
  updating = false;
  deleting = false;
  adding = false;

  farm = this.accountService.selectedFarm;
  isMain = false;

  chickStatuses?: LookupModel[];

  constructor(
    private fb: FormBuilder,
    public service: ListChickService,
    private languageService: LanguageService,
    private toastService: ToastService,
    private router: Router,
    private accountService: AccountService,
    private route: ActivatedRoute,
    private calendar: NgbCalendar
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(first()).subscribe(paramMap => {
      const coopId = paramMap.get('coopId');

      if (this.farm != null && coopId != null) {
        if (this.service.coopId && this.service.coopId !== +coopId) {
          this.service.resetDefauleState();
        }
        this.service.coopId = +coopId;

        if (this.farm.type.code === 'MAIN') {
          this.isMain = true;
        }
      } else {
        this.router.navigate(['/']);
      }
    });

    this.route.data.pipe(first()).subscribe(data => {
      if (data.lookups?.find((x: LookupCategoryModel) => x.lookupName === LookupEnum.ChickStatus)) {
        this.chickStatuses = data.lookups.find((x: LookupCategoryModel) => x.lookupName === LookupEnum.ChickStatus).lookupList;
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
          this.form.get('hatchingDate')?.setValue(dayjs());
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

  changeStatus(id: number, newStatus: string): void {
    this.updating = true;

    this.service.changeStatus(this.createChangeStatusModel(id, newStatus)).subscribe(
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

  createDeleteModel(id: number): DeleteChickModel {
    if (this.farm != null) {
      const data: DeleteChickModel = {
        coopId: this.service.coopId,
        chickId: id,
      };

      return data;
    } else {
      return {} as DeleteChickModel;
    }
  }

  createChangeStatusModel(id: number, newStatus: string): ChangeChickStatusModel {
    return {
      coopId: this.service.coopId,
      chickId: id,
      newStatus,
    };
  }

  createAddModel(): AddChickModel {
    const date: dayjs.Dayjs = this.form.get('hatchingDate')?.value;

    const data: AddChickModel = {
      coopId: this.service.coopId,
      hatchingDate: date.add(3, 'hour').toISOString(),
    };

    return data;
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
