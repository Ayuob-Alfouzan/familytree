import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'app/core/util/toast.service';
import { LookupEnum } from 'app/shared/lookup/lookup.enum';
import { LookupCategoryModel } from 'app/shared/models/lookup.model';
import { first } from 'rxjs/operators';
import { AddSheepTreatmentService } from './add.service';
import { LanguageService } from 'app/shared/language/language.service';
import { AccountService } from 'app/core/auth/account.service';
import { AddSheepTreatmentModel } from 'app/sheep-familyTree/models/treatment.model';
import * as dayjs from 'dayjs';
import { SimpleSheepModel } from 'app/sheep-familyTree/models/sheep.model';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'jhi-add-sheep-treatment',
  templateUrl: './add.component.html',
})
export class AddSheepTreatmentComponent implements OnInit {
  familyTree = this.accountService.selectedFarm;

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
    private service: AddSheepTreatmentService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private languageService: LanguageService,
    private calendar: NgbCalendar,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    if (this.familyTree) {
      this.service.listSimple(this.familyTree.farmId).subscribe(result => {
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
    });

    this.form.get('givenTo')?.valueChanges.subscribe(x => {
      console.log(x);

      if (x === 'ALL') {
        this.form.get('sheepType')?.setValue(null);
        this.form.get('sheepType')?.setValidators([]);
        this.form.get('sheepType')?.disable();
        this.form.get('sheepType')?.updateValueAndValidity();

        this.form.get('sheep')?.setValue(null);
        this.form.get('sheep')?.setValidators([]);
        this.form.get('sheep')?.disable();
        this.form.get('sheep')?.updateValueAndValidity();
      } else if (x === 'SPECIFIC_TYPE') {
        this.form.get('sheepType')?.setValidators([Validators.required]);
        this.form.get('sheepType')?.enable();
        this.form.get('sheepType')?.updateValueAndValidity();

        this.form.get('sheep')?.setValue(null);
        this.form.get('sheep')?.setValidators([]);
        this.form.get('sheep')?.disable();
        this.form.get('sheep')?.updateValueAndValidity();
      } else if (x === 'SPECIFIC_SHEEP') {
        this.form.get('sheep')?.setValidators([Validators.required]);
        this.form.get('sheep')?.enable();
        this.form.get('sheep')?.updateValueAndValidity();

        this.form.get('sheepType')?.setValue(null);
        this.form.get('sheepType')?.setValidators([]);
        this.form.get('sheepType')?.disable();
        this.form.get('sheepType')?.updateValueAndValidity();
      }
    });
  }

  add(): void {
    console.log(this.form.get('specificSheep')?.errors);
    if (this.form.valid) {
      this.submitting = true;

      this.service.add(this.createModel()).subscribe(
        () => {
          this.router.navigate(['/', 'sheep-familyTree', 'list-sheep-treatment']);
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

  createModel(): AddSheepTreatmentModel {
    if (this.familyTree) {
      const data: AddSheepTreatmentModel = {
        farmId: this.familyTree.farmId,
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
      return {} as AddSheepTreatmentModel;
    }
  }

  getSheepIds(): number[] {
    const a: SimpleSheepModel[] = this.form.get('sheep')?.value;

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
