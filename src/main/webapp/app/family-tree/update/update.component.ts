import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from 'app/core/auth/account.service';
import { ToastService } from 'app/core/util/toast.service';
import { LanguageService } from 'app/shared/language/language.service';
import { LookupEnum } from 'app/shared/lookup/lookup.enum';
import { LookupService } from 'app/shared/lookup/lookup.service';
import { LookupCategoryModel } from 'app/shared/models/lookup.model';
import * as dayjs from 'dayjs';
import { first } from 'rxjs/operators';
import { PersonModel, UpdatePersonModel } from '../models/family-tree.model';
import { UpdatePersonService } from './update.service';

@Component({
  selector: 'jhi-update-person',
  templateUrl: './update.component.html',
})
export class UpdatePersonComponent implements OnInit {
  @Input()
  person?: PersonModel;

  @Output() action = new EventEmitter<string>();

  @Output() updatedPerson = new EventEmitter<PersonModel>();

  form = this.fb.group({
    name: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
    dateOfBirth: [null, [Validators.required]],
    status: [null, [Validators.required]],
    gender: [null, [Validators.required]],
    description: [null, [Validators.maxLength(30)]],
    mobileNumber: [null, [Validators.maxLength(10)]],
    job: [null, [Validators.maxLength(30)]],
  });

  genders = [];
  lifeStatuses = [];

  submitting = false;

  currentLanguage = this.languageService.onLangChange();

  constructor(
    private fb: FormBuilder,
    private service: UpdatePersonService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private languageService: LanguageService,
    private accountService: AccountService,
    private lookupService: LookupService
  ) {}

  ngOnInit(): void {
    this.route.data.pipe(first()).subscribe(data => {
      if (data.lookups?.find((x: LookupCategoryModel) => x.lookupName === LookupEnum.Gender)) {
        this.genders = data.lookups.find((x: LookupCategoryModel) => x.lookupName === LookupEnum.Gender).lookupList;
      }

      if (data.lookups?.find((x: LookupCategoryModel) => x.lookupName === LookupEnum.LifeStatus)) {
        this.lifeStatuses = data.lookups.find((x: LookupCategoryModel) => x.lookupName === LookupEnum.LifeStatus).lookupList;
      }

      this.setupForm();
    });
  }

  setupForm(): void {
    if (this.person) {
      this.form.get('name')?.setValue(this.person.name);
      this.form.get('dateOfBirth')?.setValue(dayjs(this.person.dateOfBirth).startOf('day'));
      this.form.get('gender')?.setValue(this.lookupService.findLookupByCode(this.genders, this.person.gender));
      this.form.get('status')?.setValue(this.lookupService.findLookupByCode(this.lifeStatuses, this.person.status));
      this.form.get('description')?.setValue(this.person.description);
      this.form.get('mobileNumber')?.setValue(this.person.mobileNumber);
      this.form.get('job')?.setValue(this.person.job);
      this.form.updateValueAndValidity();
    }
  }

  update(): void {
    if (this.form.valid) {
      this.submitting = true;

      this.service.update(this.createModel()).subscribe(
        result => {
          this.submitting = false;
          this.toastService.success('global.message.successfullyUpdated');
          this.updatedPerson.emit(result);
          this.action.emit('UPDATED');
        },
        error => {
          this.errorHandler(error);
          this.submitting = false;
        }
      );
    } else {
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key)?.markAsTouched();
      });
    }
  }

  cancel(): void {
    this.action.emit('CANCEL');
  }

  createModel(): UpdatePersonModel {
    if (this.person) {
      const data: UpdatePersonModel = {
        familyTreeId: this.person.familyTreeId,
        name: this.form.get('name')?.value,
        dateOfBirth: this.form.get('dateOfBirth')?.value,
        gender: this.form.get('gender')?.value.code,
        status: this.form.get('status')?.value.code,
        description: this.form.get('description')?.value,
        mobileNumber: this.form.get('mobileNumber')?.value,
        job: this.form.get('job')?.value,
        id: this.person.id,
      };

      return data;
    } else {
      return {} as UpdatePersonModel;
    }
  }

  private errorHandler(response: HttpErrorResponse): void {
    const error = response.error;
    this.toastService.error(error);
  }
}
