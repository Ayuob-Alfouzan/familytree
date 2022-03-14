import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons';
import { AccountService } from 'app/core/auth/account.service';
import { ToastService } from 'app/core/util/toast.service';
import { ConfirmModalComponent } from 'app/shared/components/confirm-modal/confirm-modal.component';
import { AddEggModel, ChangeEggStatusModel, DeleteEggModel } from '../../models/egg.model';
import { ListEggService } from './list.service';
import { NgbdSortableHeaderDirective, SortEvent } from '../../sortable.directive';
import { first } from 'rxjs/operators';
import { LookupCategoryModel } from 'app/shared/models/lookup.model';
import { LookupEnum } from 'app/shared/lookup/lookup.enum';
import * as dayjs from 'dayjs';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { LanguageService } from 'app/shared/language/language.service';

@Component({
  selector: 'jhi-list-egg',
  templateUrl: './list.component.html',
})
export class ListEggComponent implements OnInit {
  @ViewChild('confirmDeleteModal') confirmDeleteModal?: ConfirmModalComponent;
  @ViewChildren(NgbdSortableHeaderDirective) headers?: QueryList<NgbdSortableHeaderDirective>;
  faTrashAlt = faTrashAlt;
  faEdit = faEdit;

  todayDate: NgbDateStruct = this.calendar.getToday();

  form = this.fb.group({
    layDate: [dayjs().startOf('day'), [Validators.required]],
  });

  currentLanguage = this.languageService.onLangChange();
  updating = false;
  adding = false;

  farm = this.accountService.selectedFarm;
  isMain = false;

  eggStatuses = [];

  constructor(
    private fb: FormBuilder,
    public service: ListEggService,
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
      if (data.lookups?.find((x: LookupCategoryModel) => x.lookupName === LookupEnum.EggStatus)) {
        this.eggStatuses = data.lookups.find((x: LookupCategoryModel) => x.lookupName === LookupEnum.EggStatus).lookupList;
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
          this.form.get('layDate')?.setValue(dayjs());
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
    this.updating = true;
    this.confirmDeleteModal?.open(id);
  }

  confirmed(id: number): void {
    this.service.delete(this.createDeleteModel(id)).subscribe(
      () => {
        this.service.load();
        this.updating = false;
        this.toastService.success('global.message.successfullyRemoved');
      },
      error => {
        this.service.errorHandler(error);
        this.updating = false;
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

  createDeleteModel(id: number): DeleteEggModel {
    if (this.farm != null) {
      const data: DeleteEggModel = {
        coopId: this.service.coopId,
        eggId: id,
      };

      return data;
    } else {
      return {} as DeleteEggModel;
    }
  }

  createChangeStatusModel(id: number, newStatus: string): ChangeEggStatusModel {
    return {
      coopId: this.service.coopId,
      eggId: id,
      newStatus,
    };
  }

  createAddModel(): AddEggModel {
    const date: dayjs.Dayjs = this.form.get('layDate')?.value;

    const data: AddEggModel = {
      coopId: this.service.coopId,
      layDate: date.add(3, 'hour').toISOString(),
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
