import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'app/core/util/toast.service';
import { LookupEnum } from 'app/shared/lookup/lookup.enum';
import { LookupCategoryModel } from 'app/shared/models/lookup.model';
import { first } from 'rxjs/operators';
import { UpdateSheepTreatmentService } from './update.service';
import { LanguageService } from 'app/shared/language/language.service';
import { AccountService } from 'app/core/auth/account.service';
import { SheepTreatmentModel, UpdateSheepTreatmentModel } from 'app/sheep-farm/models/treatment.model';
import * as dayjs from 'dayjs';
import { SimpleSheepModel } from 'app/sheep-farm/models/sheep.model';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'jhi-update-sheep-treatment',
  templateUrl: './update.component.html',
})
export class UpdateSheepTreatmentComponent implements OnInit {
  farm = this.accountService.selectedFarm;
  item!: SheepTreatmentModel;

  form = this.fb.group({
    type: [null, [Validators.required]],
    name: [null, [Validators.maxLength(50)]],
    doseType: [null, [Validators.required]],
    numberOfDays: [1, [Validators.required, Validators.min(1)]],
    startingDate: [dayjs().startOf('day'), [Validators.required]],
    givenTo: ['ALL', [Validators.required]],
    sheepType: [{ value: null, disabled: true }, []],
    sheep: [{ value: null, disabled: true }, []],
  });

  submitting = false;

  currentLanguage = this.languageService.onLangChange();

  todayDate: NgbDateStruct = this.calendar.getToday();

  sheepTreatmentTypes = [];
  sheepTreatmentDoseTypes = [];
  sheepTypes = [];

  sheep: SimpleSheepModel[] = [];

  sheepDropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'number',
    allowSearchFilter: true,
    enableCheckAll: false,
    searchPlaceholderText: 'ابحث بالرقم',
  };

  constructor(
    private fb: FormBuilder,
    private service: UpdateSheepTreatmentService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private languageService: LanguageService,
    private calendar: NgbCalendar,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    if (this.farm) {
      this.service.listSimple(this.farm.farmId).subscribe(result => {
        this.sheep = result;
      });
    } else {
      this.router.navigate(['/']);
    }

    this.route.data.pipe(first()).subscribe(data => {
      if (data.lookups?.find((x: LookupCategoryModel) => x.lookupName === LookupEnum.SheepTreatmentType)) {
        this.sheepTreatmentTypes = data.lookups.find((x: LookupCategoryModel) => x.lookupName === LookupEnum.SheepTreatmentType).lookupList;
      }

      if (data.lookups?.find((x: LookupCategoryModel) => x.lookupName === LookupEnum.SheepTreatmentDoseType)) {
        this.sheepTreatmentDoseTypes = data.lookups.find(
          (x: LookupCategoryModel) => x.lookupName === LookupEnum.SheepTreatmentDoseType
        ).lookupList;
      }

      if (data.lookups?.find((x: LookupCategoryModel) => x.lookupName === LookupEnum.SheepType)) {
        this.sheepTypes = data.lookups.find((x: LookupCategoryModel) => x.lookupName === LookupEnum.SheepType).lookupList;
      }

      this.item = data.item;
      this.setForm();
    });

    this.form.get('givenTo')?.valueChanges.subscribe(x => {
      this.setGivenTo(x);
    });
  }

  setGivenTo(givenTo: string): void {
    if (givenTo === 'ALL') {
      this.form.get('sheepType')?.setValue(null);
      this.form.get('sheepType')?.setValidators([]);
      this.form.get('sheepType')?.disable();
      this.form.get('sheepType')?.updateValueAndValidity();

      this.form.get('sheep')?.setValue(null);
      this.form.get('sheep')?.setValidators([]);
      this.form.get('sheep')?.disable();
      this.form.get('sheep')?.updateValueAndValidity();
    } else if (givenTo === 'SPECIFIC_TYPE') {
      this.form.get('sheepType')?.setValidators([Validators.required]);
      this.form.get('sheepType')?.enable();
      this.form.get('sheepType')?.updateValueAndValidity();

      this.form.get('sheep')?.setValue(null);
      this.form.get('sheep')?.setValidators([]);
      this.form.get('sheep')?.disable();
      this.form.get('sheep')?.updateValueAndValidity();
    } else if (givenTo === 'SPECIFIC_SHEEP') {
      this.form.get('sheep')?.setValidators([Validators.required]);
      this.form.get('sheep')?.enable();
      this.form.get('sheep')?.updateValueAndValidity();

      this.form.get('sheepType')?.setValue(null);
      this.form.get('sheepType')?.setValidators([]);
      this.form.get('sheepType')?.disable();
      this.form.get('sheepType')?.updateValueAndValidity();
    }
  }

  setForm(): void {
    this.form = this.fb.group({
      type: [this.item.type, [Validators.required]],
      name: [this.item.name, [Validators.maxLength(50)]],
      doseType: [this.item.doseType, [Validators.required]],
      numberOfDays: [this.item.numberOfDays, [Validators.required, Validators.min(1)]],
      startingDate: [dayjs(this.item.startingDate).startOf('day'), [Validators.required]],
      givenTo: [this.item.all ? 'ALL' : this.item.specificSheep ? 'SPECIFIC_SHEEP' : 'SPECIFIC_TYPE', [Validators.required]],
      sheepType: [{ value: this.item.sheepType, disabled: true }, []],
      sheep: [{ value: null, disabled: true }, []],
    });

    if (this.item.sheepTreatmentSheep && this.item.sheepTreatmentSheep.length > 0) {
      const sheep: SimpleSheepModel[] = [];
      this.item.sheepTreatmentSheep.map(x => {
        const a: SimpleSheepModel = {
          id: x.sheep.id,
          number: x.sheep.number,
          name: x.sheep.name,
        };

        sheep.push(a);
      });

      this.form.get('sheep')?.setValue(sheep);
    }
    console.log(this.form.get('sheep')?.value);
    this.setGivenTo(this.form.get('givenTo')?.value);
  }

  update(): void {
    console.log(this.form.get('sheep')?.value);
    if (this.form.valid) {
      this.submitting = true;

      this.service.update(this.createModel()).subscribe(
        () => {
          this.router.navigate(['/', 'sheep-farm', 'list-sheep-treatment']);
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

  createModel(): UpdateSheepTreatmentModel {
    if (this.farm) {
      const data: UpdateSheepTreatmentModel = {
        sheepTreatmentId: this.item.id,
        type: this.form.get('type')?.value.code,
        name: this.form.get('name')?.value,
        doseType: this.form.get('doseType')?.value.code,
        numberOfDays: this.form.get('numberOfDays')?.value,
        startingDate: this.form.get('startingDate')?.value,
      };

      if (this.form.get('givenTo')?.value === 'SPECIFIC_TYPE') {
        data.sheepType = this.form.get('sheepType')?.value.code;
      } else if (this.form.get('givenTo')?.value === 'SPECIFIC_SHEEP') {
        data.sheep = this.getSheepIds();
      }

      return data;
    } else {
      return {} as UpdateSheepTreatmentModel;
    }
  }

  getSheepIds(): number[] {
    const a: SimpleSheepModel[] = this.form.get('sheep')?.value;
    console.log(a);

    if (a.length > 0) {
      return a.map(x => x.id);
    } else {
      return [];
    }
  }

  private errorHandler(response: HttpErrorResponse): void {
    const error = response.error;
    this.toastService.error(error);
  }
}
