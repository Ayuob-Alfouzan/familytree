import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'app/core/util/toast.service';
import { LookupEnum } from 'app/shared/lookup/lookup.enum';
import { LookupCategoryModel } from 'app/shared/models/lookup.model';
import { first } from 'rxjs/operators';
import { UpdateSheepVaccinationService } from './update.service';
import { SimpleCoopModel } from 'app/familyTree/models/coop.model';
import { LanguageService } from 'app/shared/language/language.service';
import { AccountService } from 'app/core/auth/account.service';
import {
  AddSheepVaccinationModel,
  SheepVaccinationDoseModel,
  SheepVaccinationModel,
  UpdateSheepVaccinationModel,
  VaccinationDoseDateModel,
} from 'app/sheep-familyTree/models/vaccination.model';
import * as dayjs from 'dayjs';

@Component({
  selector: 'jhi-update-sheep-vaccination',
  templateUrl: './update.component.html',
})
export class UpdateSheepVaccinationComponent implements OnInit {
  familyTree = this.accountService.selectedFarm;
  item!: SheepVaccinationModel;

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
    private service: UpdateSheepVaccinationService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private languageService: LanguageService,
    private calendar: NgbCalendar,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.route.data.pipe(first()).subscribe(data => {
      if (data.lookups?.find((x: LookupCategoryModel) => x.lookupName === LookupEnum.SheepVaccinationType)) {
        this.sheepVaccinationTypes = data.lookups.find(
          (x: LookupCategoryModel) => x.lookupName === LookupEnum.SheepVaccinationType
        ).lookupList;
      }

      this.item = data.item;
      this.setForm();
    });
  }

  setForm(): void {
    this.form = this.fb.group({
      type: [this.item.type, [Validators.required]],
      name: [this.item.name, [Validators.maxLength(50)]],
      numberOfDoses: [this.item.sheepVaccinationDoses.length, [Validators.min(1)]],
      doses: this.fb.array([]),
    });

    for (let i = 0; i < this.item.sheepVaccinationDoses.length; i++) {
      this.doses.push(this.createDoseForm(this.item.sheepVaccinationDoses[i]));
    }
  }

  createDoseForm(dose?: SheepVaccinationDoseModel): FormGroup {
    const form = this.fb.group({
      month: [dose ? dose.month : null, [Validators.required, Validators.min(1), Validators.max(12)]],
      day: [dose ? dose.day : null, [Validators.required, Validators.min(1), Validators.max(30)]],
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

  update(): void {
    if (this.form.valid) {
      this.submitting = true;

      this.service.add(this.createModel()).subscribe(
        () => {
          this.router.navigate(['/', 'sheep-familyTree', 'view-sheep-vaccination', this.item.id]);
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

      for (let i = 0; i < this.form.get('numberOfDoses')?.value; i++) {
        this.getDoseForm(i).markAllAsTouched();
      }
    }
  }

  createModel(): UpdateSheepVaccinationModel {
    if (this.familyTree) {
      const doses: VaccinationDoseDateModel[] = [];

      for (let i = 0; i < this.form.get('numberOfDoses')?.value; i++) {
        const dose: VaccinationDoseDateModel = {
          month: this.getDoseForm(i).get('month')?.value,
          day: this.getDoseForm(i).get('day')?.value,
        };

        doses.push(dose);
      }

      const data: UpdateSheepVaccinationModel = {
        sheepVaccinationId: this.item.id,
        type: this.form.get('type')?.value.code,
        name: this.form.get('name')?.value,
        sheepVaccinationDoses: doses,
      };

      return data;
    } else {
      return {} as UpdateSheepVaccinationModel;
    }
  }

  private errorHandler(response: HttpErrorResponse): void {
    const error = response.error;
    this.toastService.error(error);
  }
}
