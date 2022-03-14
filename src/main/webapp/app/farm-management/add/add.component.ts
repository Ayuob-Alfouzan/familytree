import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from 'app/core/auth/account.service';
import { ToastService } from 'app/core/util/toast.service';
import { LanguageService } from 'app/shared/language/language.service';
import { LookupEnum } from 'app/shared/lookup/lookup.enum';
import { LookupCategoryModel } from 'app/shared/models/lookup.model';
import { first } from 'rxjs/operators';
import { AddFarmModel } from '../models/farm.model';
import { AddFarmService } from './add.service';

@Component({
  selector: 'jhi-add-farm',
  templateUrl: './add.component.html',
})
export class AddFarmComponent implements OnInit {
  form = this.fb.group({
    nameAr: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
    nameEn: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
    location: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
    type: [null, [Validators.required]],
    notRegisteredInVat: [false, [Validators.required]],
    vatNumber: [null, [Validators.required, Validators.minLength(15), Validators.maxLength(15)]],
  });

  farmTypes = [];

  submitting = false;

  currentLanguage = this.languageService.onLangChange();

  constructor(
    private fb: FormBuilder,
    private service: AddFarmService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private languageService: LanguageService,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.route.data.pipe(first()).subscribe(data => {
      if (data.lookups?.find((x: LookupCategoryModel) => x.lookupName === LookupEnum.FarmType)) {
        this.farmTypes = data.lookups.find((x: LookupCategoryModel) => x.lookupName === LookupEnum.FarmType).lookupList;
      }
    });

    this.form.get('notRegisteredInVat')?.valueChanges.subscribe(x => {
      if (x) {
        this.form.get('vatNumber')?.setValidators([]);
        this.form.get('vatNumber')?.updateValueAndValidity();
      } else {
        this.form.get('vatNumber')?.setValidators([Validators.required, Validators.minLength(15), Validators.maxLength(15)]);
        this.form.get('vatNumber')?.updateValueAndValidity();
      }
    });
  }

  add(): void {
    if (this.form.valid) {
      this.submitting = true;

      this.service.add(this.createAddFarmModel()).subscribe(
        () => {
          this.accountService.identity(true).subscribe();
          this.router.navigate(['/', 'farm-management']);
          this.submitting = false;
          this.toastService.success('global.message.successfullyAdded');
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

  createAddFarmModel(): AddFarmModel {
    const data: AddFarmModel = {
      nameAr: this.form.get('nameAr')?.value,
      nameEn: this.form.get('nameEn')?.value,
      location: this.form.get('location')?.value,
      type: this.form.get('type')?.value.code,
    };

    if (!this.form.get('notRegisteredInVat')?.value) {
      data.vatNumber = this.form.get('vatNumber')?.value;
    }

    return data;
  }

  private errorHandler(response: HttpErrorResponse): void {
    const error = response.error;
    this.toastService.error(error);
  }
}
