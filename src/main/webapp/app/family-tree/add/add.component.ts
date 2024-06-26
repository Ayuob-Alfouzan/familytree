import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from 'app/core/auth/account.service';
import { ToastService } from 'app/core/util/toast.service';
import { LanguageService } from 'app/shared/language/language.service';
import { LookupEnum } from 'app/shared/lookup/lookup.enum';
import { LookupCategoryModel } from 'app/shared/models/lookup.model';
import * as dayjs from 'dayjs';
import { first } from 'rxjs/operators';
import { AddChildModel, AddFatherModel, PersonModel } from '../models/family-tree.model';
import { AddPersonService } from './add.service';

@Component({
  selector: 'jhi-add-person',
  templateUrl: './add.component.html',
})
export class AddPersonComponent implements OnInit {
  @Input()
  person?: PersonModel;

  @Input()
  childGender?: string;

  @Input()
  addingFather = false;

  @Output() action = new EventEmitter<string>();

  @Output() addedPerson = new EventEmitter<PersonModel>();

  form = this.fb.group({
    name: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
    dateOfBirth: [dayjs().startOf('day'), [Validators.required]],
    status: [{ code: 'ALIVE', ar: 'حي', en: 'Alive' }, [Validators.required]],
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
    private service: AddPersonService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private languageService: LanguageService,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.route.data.pipe(first()).subscribe(data => {
      if (data.lookups?.find((x: LookupCategoryModel) => x.lookupName === LookupEnum.Gender)) {
        this.genders = data.lookups.find((x: LookupCategoryModel) => x.lookupName === LookupEnum.Gender).lookupList;
      }

      if (data.lookups?.find((x: LookupCategoryModel) => x.lookupName === LookupEnum.LifeStatus)) {
        this.lifeStatuses = data.lookups.find((x: LookupCategoryModel) => x.lookupName === LookupEnum.LifeStatus).lookupList;
      }
    });
  }

  add(): void {
    if (this.form.valid) {
      this.submitting = true;

      if (this.addingFather) {
        this.service.addFather(this.createFatherModel()).subscribe(
          result => {
            this.submitting = false;
            this.toastService.success('global.message.successfullyAdded');
            this.addedPerson.emit(result);
            this.action.emit('ADDED');
          },
          error => {
            this.errorHandler(error);
            this.submitting = false;
          }
        );
      } else {
        this.service.addChild(this.createChildModel()).subscribe(
          result => {
            this.submitting = false;
            this.toastService.success('global.message.successfullyAdded');
            this.addedPerson.emit(result);
            this.action.emit('ADDED');
          },
          error => {
            this.errorHandler(error);
            this.submitting = false;
          }
        );
      }
    } else {
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key)?.markAsTouched();
      });
    }
  }

  cancel(): void {
    this.action.emit('CANCEL');
  }

  createChildModel(): AddChildModel {
    if (this.person && this.childGender) {
      const data: AddChildModel = {
        familyTreeId: this.person.familyTreeId,
        name: this.form.get('name')?.value,
        dateOfBirth: this.form.get('dateOfBirth')?.value,
        gender: this.childGender,
        status: this.form.get('status')?.value.code,
        description: this.form.get('description')?.value,
        mobileNumber: this.form.get('mobileNumber')?.value,
        job: this.form.get('job')?.value,
        fatherId: this.person.id,
      };

      return data;
    } else {
      return {} as AddChildModel;
    }
  }

  createFatherModel(): AddFatherModel {
    if (this.person && this.childGender) {
      const data: AddFatherModel = {
        familyTreeId: this.person.familyTreeId,
        name: this.form.get('name')?.value,
        dateOfBirth: this.form.get('dateOfBirth')?.value,
        gender: this.childGender,
        status: this.form.get('status')?.value.code,
        description: this.form.get('description')?.value,
        mobileNumber: this.form.get('mobileNumber')?.value,
        job: this.form.get('job')?.value,
        childId: this.person.id,
      };

      return data;
    } else {
      return {} as AddFatherModel;
    }
  }

  private errorHandler(response: HttpErrorResponse): void {
    const error = response.error;
    this.toastService.error(error);
  }
}
