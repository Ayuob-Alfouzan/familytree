import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'app/core/util/toast.service';
import { LookupEnum } from 'app/shared/lookup/lookup.enum';
import { LookupCategoryModel } from 'app/shared/models/lookup.model';
import { first } from 'rxjs/operators';
import { UpdateSheepService } from './update.service';
import { LanguageService } from 'app/shared/language/language.service';
import { AccountService } from 'app/core/auth/account.service';
import { SheepModel, SimpleSheepModel, UpdateSheepModel } from 'app/sheep-farm/models/sheep.model';

@Component({
  selector: 'jhi-update-sheep',
  templateUrl: './update.component.html',
})
export class UpdateSheepComponent implements OnInit {
  farm = this.accountService.selectedFarm;
  item!: SheepModel;

  form = this.fb.group({
    number: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
    name: [null, [Validators.maxLength(20)]],
    type: [null, [Validators.required]],
    category: [null, [Validators.required]],
    gender: [null, [Validators.required]],
    status: [null, [Validators.required]],
    ageInDays: [null, [Validators.required, Validators.min(0), Validators.max(30)]],
    ageInMonths: [null, [Validators.required, Validators.min(0), Validators.max(11)]],
    ageInYears: [null, [Validators.required, Validators.min(0), Validators.max(30)]],
    father: [null, []],
    mother: [null, []],
    fatherName: [null, [Validators.maxLength(255)]],
    motherName: [null, [Validators.maxLength(255)]],
  });

  sheepTypes = [];
  sheepCategories = [];
  sheepGenderes = [];
  sheepStatuses = [];

  fathers: SimpleSheepModel[] = [];
  mothers: SimpleSheepModel[] = [];

  submitting = false;

  currentLanguage = this.languageService.onLangChange();

  constructor(
    private fb: FormBuilder,
    private service: UpdateSheepService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private languageService: LanguageService,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.route.data.pipe(first()).subscribe(data => {
      if (data.item) {
        this.item = data.item;
        this.setForm();

        if (this.farm) {
          this.service.listSimple(this.farm.farmId, ['RAM']).subscribe(
            result => {
              this.fathers = result;

              if (this.item.father) {
                const fatherId = this.item.father.id;
                const father = this.fathers.find(x => x.id === fatherId);
                this.form.get('father')?.setValue(father);
              }
            },
            error => this.errorHandler(error)
          );
          this.service.listSimple(this.farm.farmId, ['EWE', 'PREGNANT', 'LAMBED']).subscribe(
            result => {
              this.mothers = result;

              if (this.item.mother) {
                const motherId = this.item.mother.id;
                const mother = this.mothers.find(x => x.id === motherId);
                this.form.get('mother')?.setValue(mother);
              }
            },
            error => this.errorHandler(error)
          );
        }
      } else {
        this.router.navigate(['/', 'sheep-farm', 'list']);
      }

      if (data.lookups?.find((x: LookupCategoryModel) => x.lookupName === LookupEnum.SheepType)) {
        this.sheepTypes = data.lookups.find((x: LookupCategoryModel) => x.lookupName === LookupEnum.SheepType).lookupList;
      }

      if (data.lookups?.find((x: LookupCategoryModel) => x.lookupName === LookupEnum.SheepCategory)) {
        this.sheepCategories = data.lookups.find((x: LookupCategoryModel) => x.lookupName === LookupEnum.SheepCategory).lookupList;
      }

      if (data.lookups?.find((x: LookupCategoryModel) => x.lookupName === LookupEnum.SheepGender)) {
        this.sheepGenderes = data.lookups.find((x: LookupCategoryModel) => x.lookupName === LookupEnum.SheepGender).lookupList;
      }

      if (data.lookups?.find((x: LookupCategoryModel) => x.lookupName === LookupEnum.SheepStatus)) {
        this.sheepStatuses = data.lookups.find((x: LookupCategoryModel) => x.lookupName === LookupEnum.SheepStatus).lookupList;
      }
    });
  }

  setForm(): void {
    this.form = this.fb.group({
      number: [this.item.number, [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      name: [this.item.name, [Validators.maxLength(20)]],
      type: [this.item.type, [Validators.required]],
      category: [this.item.category, [Validators.required]],
      gender: [this.item.gender, [Validators.required]],
      status: [this.item.status, [Validators.required]],
      ageInDays: [this.item.ageInDays, [Validators.required, Validators.min(0), Validators.max(30)]],
      ageInMonths: [this.item.ageInMonths, [Validators.required, Validators.min(0), Validators.max(11)]],
      ageInYears: [this.item.ageInYears, [Validators.required, Validators.min(0), Validators.max(30)]],
      father: [null, []],
      mother: [null, []],
      fatherName: [this.item.fatherName, [Validators.maxLength(255)]],
      motherName: [this.item.motherName, [Validators.maxLength(255)]],
    });
  }

  update(): void {
    if (this.form.valid) {
      this.submitting = true;

      this.service.update(this.createUpdateModel()).subscribe(
        () => {
          this.router.navigate(['/', 'sheep-farm', 'list']);
          this.submitting = false;
          this.toastService.success('global.message.successfullyUpdated');
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

  createUpdateModel(): UpdateSheepModel {
    if (this.farm) {
      const data: UpdateSheepModel = {
        sheepId: this.item.id,
        number: this.form.get('number')?.value,
        name: this.form.get('name')?.value,
        type: this.form.get('type')?.value.code,
        gender: this.form.get('gender')?.value.code,
        category: this.form.get('category')?.value.code,
        status: this.form.get('status')?.value.code,
        ageInDays: this.form.get('ageInDays')?.value,
        ageInMonths: this.form.get('ageInMonths')?.value,
        ageInYears: this.form.get('ageInYears')?.value,
        fatherId: this.form.get('father')?.value ? this.form.get('father')?.value.id : null,
        motherId: this.form.get('mother')?.value ? this.form.get('mother')?.value.id : null,
        fatherName: this.form.get('fatherName')?.value,
        motherName: this.form.get('motherName')?.value,
      };

      return data;
    } else {
      return {} as UpdateSheepModel;
    }
  }

  private errorHandler(response: HttpErrorResponse): void {
    const error = response.error;
    this.toastService.error(error);
  }
}
