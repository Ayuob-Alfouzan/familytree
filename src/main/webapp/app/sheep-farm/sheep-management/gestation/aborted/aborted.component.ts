import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'app/core/util/toast.service';
import { first } from 'rxjs/operators';
import { AbortedGestationService } from './aborted.service';
import { LanguageService } from 'app/shared/language/language.service';
import { AccountService } from 'app/core/auth/account.service';
import { AbortedGestationModel, GestationModel } from 'app/sheep-farm/models/gestation.model';
import * as dayjs from 'dayjs';

@Component({
  selector: 'jhi-aborted-gestation',
  templateUrl: './aborted.component.html',
})
export class AbortedGestationComponent implements OnInit {
  farm = this.accountService.selectedFarm;
  item?: GestationModel;

  form = this.fb.group({
    gestationId: [null, [Validators.required]],
    endDate: [dayjs().startOf('day'), [Validators.required]],
  });

  submitting = false;

  currentLanguage = this.languageService.onLangChange();

  constructor(
    private fb: FormBuilder,
    private service: AbortedGestationService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private languageService: LanguageService,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.route.data.pipe(first()).subscribe(data => {
      this.item = data.item;

      if (!this.item || !this.farm) {
        this.router.navigate(['/', 'sheep-farm']);
      }

      this.form.get('gestationId')?.setValue(this.item?.id);
    });
  }

  aborted(): void {
    if (this.form.valid) {
      this.submitting = true;

      this.service.aborted(this.createModel()).subscribe(
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

  createModel(): AbortedGestationModel {
    const data: AbortedGestationModel = {
      gestationId: this.form.get('gestationId')?.value,
      endDate: this.form.get('endDate')?.value,
    };

    return data;
  }

  private errorHandler(response: HttpErrorResponse): void {
    const error = response.error;
    this.toastService.error(error);
  }
}
