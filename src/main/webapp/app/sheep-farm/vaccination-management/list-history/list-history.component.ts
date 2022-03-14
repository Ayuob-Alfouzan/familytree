import { Component, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faEye, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { AccountService } from 'app/core/auth/account.service';
import { ToastService } from 'app/core/util/toast.service';
import { ConfirmModalComponent } from 'app/shared/components/confirm-modal/confirm-modal.component';
import { ListSheepVaccinationHistoryService } from './list-history.service';
import { NgbdSortableHeaderDirective, SortEvent } from '../../sortable.directive';
import { first } from 'rxjs/operators';
import { LookupCategoryModel } from 'app/shared/models/lookup.model';
import { LookupEnum } from 'app/shared/lookup/lookup.enum';
import { LanguageService } from 'app/shared/language/language.service';
import {
  AddSheepVaccinationHistoryModel,
  DeleteSheepVaccinationHistoryModel,
  SheepVaccinationModel,
} from 'app/sheep-familyTree/models/vaccination.model';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import * as dayjs from 'dayjs';

@Component({
  selector: 'jhi-list-sheep-vaccination-history',
  templateUrl: './list-history.component.html',
})
export class ListSheepVaccinationHistoryComponent implements OnInit {
  @Input() vaccination!: SheepVaccinationModel;

  @ViewChild('confirmDeleteModal') confirmDeleteModal?: ConfirmModalComponent;
  faTrashAlt = faTrashAlt;

  currentLanguage = this.languageService.onLangChange();
  deleting = false;
  adding = false;

  familyTree = this.accountService.selectedFarm;
  isMain = false;

  form = this.fb.group({
    doseDate: [dayjs().startOf('day'), [Validators.required]],
  });

  constructor(
    private fb: FormBuilder,
    public service: ListSheepVaccinationHistoryService,
    private languageService: LanguageService,
    private toastService: ToastService,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    if (this.familyTree && this.familyTree.type.code === 'MAIN') {
      this.isMain = true;
    }
  }

  add(): void {
    if (this.form.valid) {
      this.adding = true;

      this.service.add(this.createAddModel()).subscribe(
        result => {
          this.adding = false;
          this.toastService.success('global.message.successfullyAdded');
          this.vaccination = result;
          this.form.reset();
        },
        error => {
          this.errorHandler(error);
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
      result => {
        this.vaccination = result;
        this.deleting = false;
        this.toastService.success('global.message.successfullyRemoved');
      },
      error => {
        this.errorHandler(error);
        this.deleting = false;
      }
    );
  }

  createDeleteModel(id: number): DeleteSheepVaccinationHistoryModel {
    const data: DeleteSheepVaccinationHistoryModel = {
      sheepVaccinationId: this.vaccination.id,
      sheepVaccinationHistoryId: id,
    };

    return data;
  }

  createAddModel(): AddSheepVaccinationHistoryModel {
    const data: AddSheepVaccinationHistoryModel = {
      sheepVaccinationId: this.vaccination.id,
      date: this.form.get('doseDate')?.value,
    };

    return data;
  }

  private errorHandler(response: HttpErrorResponse): void {
    const error = response.error;
    this.toastService.error(error);
  }
}
