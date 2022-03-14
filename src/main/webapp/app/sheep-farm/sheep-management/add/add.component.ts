import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'app/core/util/toast.service';
import { LookupEnum } from 'app/shared/lookup/lookup.enum';
import { LookupCategoryModel } from 'app/shared/models/lookup.model';
import { first } from 'rxjs/operators';
import { AddSheepService } from './add.service';
import { LanguageService } from 'app/shared/language/language.service';
import { AccountService } from 'app/core/auth/account.service';
import { AddSheepModel, SimpleSheepModel } from 'app/sheep-familyTree/models/sheep.model';

@Component({
  selector: 'jhi-add-sheep',
  templateUrl: './add.component.html',
})
export class AddSheepComponent implements OnInit {
  familyTree = this.accountService.selectedFarm;

  form = this.fb.group({
    number: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
    name: [null, [Validators.maxLength(20)]],
    type: [null, [Validators.required]],
    category: [null, [Validators.required]],
    gender: [null, [Validators.required]],
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

  fathers: SimpleSheepModel[] = [];
  mothers: SimpleSheepModel[] = [];

  submitting = false;

  currentLanguage = this.languageService.onLangChange();

  constructor(
    private fb: FormBuilder,
    private service: AddSheepService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private languageService: LanguageService,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.route.data.pipe(first()).subscribe(data => {
      if (data.lookups?.find((x: LookupCategoryModel) => x.lookupName === LookupEnum.SheepType)) {
        this.sheepTypes = data.lookups.find((x: LookupCategoryModel) => x.lookupName === LookupEnum.SheepType).lookupList;
      }

      if (data.lookups?.find((x: LookupCategoryModel) => x.lookupName === LookupEnum.SheepCategory)) {
        this.sheepCategories = data.lookups.find((x: LookupCategoryModel) => x.lookupName === LookupEnum.SheepCategory).lookupList;
      }

      if (data.lookups?.find((x: LookupCategoryModel) => x.lookupName === LookupEnum.SheepGender)) {
        this.sheepGenderes = data.lookups.find((x: LookupCategoryModel) => x.lookupName === LookupEnum.SheepGender).lookupList;
      }

      if (this.familyTree) {
        this.service.listSimple(this.familyTree.farmId, ['RAM']).subscribe(
          result => (this.fathers = result),
          error => this.errorHandler(error)
        );
        this.service.listSimple(this.familyTree.farmId, ['EWE', 'PREGNANT', 'LAMBED']).subscribe(
          result => (this.mothers = result),
          error => this.errorHandler(error)
        );
      }
    });
  }

  add(): void {
    if (this.form.valid) {
      this.submitting = true;

      this.service.add(this.createAddModel()).subscribe(
        () => {
          this.router.navigate(['/', 'sheep-familyTree', 'list']);
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

  createAddModel(): AddSheepModel {
    if (this.familyTree) {
      const data: AddSheepModel = {
        farmId: this.familyTree.farmId,
        number: this.form.get('number')?.value,
        name: this.form.get('name')?.value,
        type: this.form.get('type')?.value.code,
        gender: this.form.get('gender')?.value.code,
        category: this.form.get('category')?.value.code,
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
      return {} as AddSheepModel;
    }
  }

  private errorHandler(response: HttpErrorResponse): void {
    const error = response.error;
    this.toastService.error(error);
  }
}
