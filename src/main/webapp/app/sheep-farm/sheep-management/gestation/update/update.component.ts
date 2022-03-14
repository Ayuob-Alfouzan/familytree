import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'app/core/util/toast.service';
import { first } from 'rxjs/operators';
import { UpdateGestationService } from './update.service';
import { LanguageService } from 'app/shared/language/language.service';
import { AccountService } from 'app/core/auth/account.service';
import { GestationModel, UpdateGestationModel } from 'app/sheep-farm/models/gestation.model';
import * as dayjs from 'dayjs';

@Component({
  selector: 'jhi-update-gestation',
  templateUrl: './update.component.html',
})
export class UpdateGestationComponent implements OnInit {
  farm = this.accountService.selectedFarm;
  item?: GestationModel;

  form = this.fb.group({
    gestationId: [null, [Validators.required]],
    impregnationDate: [null, [Validators.required]],
    numberOfLambs: [null, [Validators.required]],
  });

  submitting = false;

  currentLanguage = this.languageService.onLangChange();

  constructor(
    private fb: FormBuilder,
    private service: UpdateGestationService,
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
        this.form.get('impregnationDate')?.setValue(dayjs(this.item.impregnationDate).startOf('day'));
        this.form.get('numberOfLambs')?.setValue(this.item.numberOfLambs);
      } else {
        this.router.navigate(['/', 'sheep-farm']);
      }
    });
  }

  update(): void {
    if (this.form.valid) {
      this.submitting = true;

      this.service.update(this.createModel()).subscribe(
        () => {
          this.router.navigate(['/', 'sheep-farm', 'view', this.item?.ewe.id]);
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

  createModel(): UpdateGestationModel {
    const data: UpdateGestationModel = {
      gestationId: this.form.get('gestationId')?.value,
      impregnationDate: this.form.get('impregnationDate')?.value,
      numberOfLambs: this.form.get('numberOfLambs')?.value,
    };

    return data;
  }

  private errorHandler(response: HttpErrorResponse): void {
    const error = response.error;
    this.toastService.error(error);
  }
}
