import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'app/core/util/toast.service';
import { LanguageService } from 'app/shared/language/language.service';
import { first } from 'rxjs/operators';
import { EditFarmModel, FarmModel } from '../models/farm.model';
import { EditFarmService } from './edit.service';

@Component({
  selector: 'jhi-edit-farm',
  templateUrl: './edit.component.html',
})
export class EditFarmComponent implements OnInit {
  form = this.fb.group({
    id: [null, []],
    nameAr: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
    nameEn: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
    location: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
    notRegisteredInVat: [false, [Validators.required]],
    vatNumber: [null, [Validators.required, Validators.minLength(15), Validators.maxLength(15)]],
  });

  farm?: FarmModel;

  submitting = false;

  currentLanguage = this.languageService.onLangChange();

  constructor(
    private fb: FormBuilder,
    private service: EditFarmService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    this.route.data.pipe(first()).subscribe(data => {
      this.setForm(data.farm);
    });
  }

  setForm(farmData: FarmModel): void {
    this.farm = farmData;

    this.form.get('id')?.setValue(farmData.id);
    this.form.get('nameAr')?.setValue(farmData.nameAr);
    this.form.get('nameEn')?.setValue(farmData.nameEn);
    this.form.get('location')?.setValue(farmData.location);

    if (farmData.vatNumber) {
      this.form.get('vatNumber')?.setValue(farmData.vatNumber);
    } else {
      this.form.get('notRegisteredInVat')?.setValue(true);
      this.form.get('vatNumber')?.setValidators([]);
      this.form.get('vatNumber')?.updateValueAndValidity();
    }

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

  edit(): void {
    if (this.form.valid) {
      this.submitting = true;

      this.service.edit(this.createEditFarmModel()).subscribe(
        () => {
          this.router.navigate(['/', 'farm-management']);
          this.submitting = false;
          this.toastService.success('global.message.successfullyEdited');
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

  createEditFarmModel(): EditFarmModel {
    const data: EditFarmModel = {
      id: this.form.get('id')?.value,
      nameAr: this.form.get('nameAr')?.value,
      nameEn: this.form.get('nameEn')?.value,
      location: this.form.get('location')?.value,
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
