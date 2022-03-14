import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'app/core/util/toast.service';
import { first } from 'rxjs/operators';
import { LambedGestationService } from './lambed.service';
import { LanguageService } from 'app/shared/language/language.service';
import { AccountService } from 'app/core/auth/account.service';
import { GestationModel, LambedGestationDetailsModel, LambedGestationModel } from 'app/sheep-farm/models/gestation.model';
import * as dayjs from 'dayjs';
import { LookupCategoryModel } from 'app/shared/models/lookup.model';
import { LookupEnum } from 'app/shared/lookup/lookup.enum';

@Component({
  selector: 'jhi-lambed-gestation',
  templateUrl: './lambed.component.html',
})
export class LambedGestationComponent implements OnInit {
  farm = this.accountService.selectedFarm;
  item?: GestationModel;

  form = this.fb.group({
    gestationId: [null, [Validators.required]],
    lambingDate: [dayjs().startOf('day'), [Validators.required]],
    numberOfLambs: [null, [Validators.required]],
    lambs: this.fb.array([]),
  });

  submitting = false;

  currentLanguage = this.languageService.onLangChange();

  sheepGenderes = [];

  constructor(
    private fb: FormBuilder,
    private service: LambedGestationService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private languageService: LanguageService,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.route.data.pipe(first()).subscribe(data => {
      this.item = data.item;

      if (this.item && this.farm) {
        this.form.get('gestationId')?.setValue(this.item.id);
        this.form.get('numberOfLambs')?.setValue(this.item.numberOfLambs);

        for (let i = 0; i < this.item.numberOfLambs; i++) {
          this.lambs.push(this.createLambForm(this.item));
        }

        if (data.lookups?.find((x: LookupCategoryModel) => x.lookupName === LookupEnum.SheepGender)) {
          this.sheepGenderes = data.lookups.find((x: LookupCategoryModel) => x.lookupName === LookupEnum.SheepGender).lookupList;
        }

        this.form.get('numberOfLambs')?.valueChanges.subscribe(x => {
          if (x > 0 && this.item) {
            this.lambs.clear();

            for (let i = 0; i < x; i++) {
              this.lambs.push(this.createLambForm(this.item));
            }
          }
        });
      } else {
        this.router.navigate(['/', 'sheep-farm']);
      }
    });
  }

  lambed(): void {
    if (this.form.valid) {
      this.submitting = true;

      this.service.lambed(this.createModel()).subscribe(
        () => {
          this.router.navigate(['/', 'sheep-farm', 'view', this.item?.ewe.id]);
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

      for (let i = 0; i < this.form.get('numberOfLambs')?.value; i++) {
        this.getLambForm(i).markAllAsTouched();
      }
    }
  }

  createModel(): LambedGestationModel {
    const lambs: LambedGestationDetailsModel[] = [];

    for (let i = 0; i < this.form.get('numberOfLambs')?.value; i++) {
      const lamb: LambedGestationDetailsModel = {
        number: this.getLambForm(i).get('number')?.value,
        gender: this.getLambForm(i).get('gender')?.value.code,
      };

      lambs.push(lamb);
    }

    const data: LambedGestationModel = {
      gestationId: this.form.get('gestationId')?.value,
      lambingDate: this.form.get('lambingDate')?.value,
      lambedGestationDetailsRequestVMList: lambs,
    };

    return data;
  }

  createLambForm(item: GestationModel): FormGroup {
    const lambForm = this.fb.group({
      number: [item.ewe.number, [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      gender: [null, [Validators.required]],
    });

    return lambForm;
  }

  get lambs(): FormArray {
    return this.form.get('lambs') as FormArray;
  }

  getLambForm(i: number): FormGroup {
    return this.lambs.controls[i] as FormGroup;
  }

  private errorHandler(response: HttpErrorResponse): void {
    const error = response.error;
    this.toastService.error(error);
  }
}
