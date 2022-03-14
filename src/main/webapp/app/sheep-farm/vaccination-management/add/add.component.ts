import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'app/core/util/toast.service';
import { LookupEnum } from 'app/shared/lookup/lookup.enum';
import { LookupCategoryModel } from 'app/shared/models/lookup.model';
import { first } from 'rxjs/operators';
import { AddSheepVaccinationService } from './add.service';
import { LanguageService } from 'app/shared/language/language.service';
import { AccountService } from 'app/core/auth/account.service';
import { AddSheepVaccinationModel, VaccinationDoseDateModel } from 'app/sheep-familyTree/models/vaccination.model';

@Component({
  selector: 'jhi-add-sheep-vaccination',
  templateUrl: './add.component.html',
})
export class AddSheepVaccinationComponent implements OnInit {
  familyTree = this.accountService.selectedFarm;

  form = this.fb.group({
    type: [null, [Validators.required]],
    name: [null, [Validators.maxLength(50)]],
    numberOfDoses: [1, [Validators.min(1)]],
    doses: this.fb.array([this.createDoseForm()]),
  });

  submitting = false;

  currentLanguage = this.languageService.onLangChange();

  todayDate: NgbDateStruct = this.calendar.getToday();

  sheepVaccinationTypes = [];

  constructor(
    private fb: FormBuilder,
    private service: AddSheepVaccinationService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private languageService: LanguageService,
    private calendar: NgbCalendar,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    if (!this.familyTree) {
      this.router.navigate(['/']);
    }

    this.route.data.pipe(first()).subscribe(data => {
      if (data.lookups?.find((x: LookupCategoryModel) => x.lookupName === LookupEnum.SheepVaccinationType)) {
        this.sheepVaccinationTypes = data.lookups.find(
          (x: LookupCategoryModel) => x.lookupName === LookupEnum.SheepVaccinationType
        ).lookupList;
      }
    });
  }

  createDoseForm(): FormGroup {
    const form = this.fb.group({
      month: [null, [Validators.required, Validators.min(1), Validators.max(12)]],
      day: [null, [Validators.required, Validators.min(1), Validators.max(30)]],
    });

    return form;
  }

  get doses(): FormArray {
    return this.form.get('doses') as FormArray;
  }

  addDose(): void {
    this.form.get('numberOfDoses')?.setValue(+this.form.get('numberOfDoses')?.value + 1);
    this.doses.push(this.createDoseForm());
  }

  removeDose(): void {
    this.form.get('numberOfDoses')?.setValue(+this.form.get('numberOfDoses')?.value - 1);
    this.doses.removeAt(this.form.get('numberOfDoses')?.value);
  }

  getDoseForm(i: number): FormGroup {
    return this.doses.controls[i] as FormGroup;
  }

  add(): void {
    if (this.form.valid) {
      this.submitting = true;

      this.service.add(this.createModel()).subscribe(
        () => {
          this.router.navigate(['/', 'sheep-familyTree', 'list-sheep-vaccination']);
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

      for (let i = 0; i < this.form.get('numberOfDoses')?.value; i++) {
        this.getDoseForm(i).markAllAsTouched();
      }
    }
  }

  createModel(): AddSheepVaccinationModel {
    if (this.familyTree) {
      const doses: VaccinationDoseDateModel[] = [];

      for (let i = 0; i < this.form.get('numberOfDoses')?.value; i++) {
        const dose: VaccinationDoseDateModel = {
          month: this.getDoseForm(i).get('month')?.value,
          day: this.getDoseForm(i).get('day')?.value,
        };

        doses.push(dose);
      }

      const data: AddSheepVaccinationModel = {
        farmId: this.familyTree.farmId,
        type: this.form.get('type')?.value.code,
        name: this.form.get('name')?.value,
        sheepVaccinationDoses: doses,
      };

      return data;
    } else {
      return {} as AddSheepVaccinationModel;
    }
  }

  private errorHandler(response: HttpErrorResponse): void {
    const error = response.error;
    this.toastService.error(error);
  }
}
