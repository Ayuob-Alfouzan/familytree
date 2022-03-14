import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'app/core/util/toast.service';
import { first } from 'rxjs/operators';
import { ConfirmedCopulationService } from './confirmed.service';
import { LanguageService } from 'app/shared/language/language.service';
import { AccountService } from 'app/core/auth/account.service';
import * as dayjs from 'dayjs';
import { ConfirmCopulationModel, CopulationModel } from 'app/sheep-farm/models/copulation.model';

@Component({
  selector: 'jhi-confirmed-copulation',
  templateUrl: './confirmed.component.html',
})
export class ConfirmedCopulationComponent implements OnInit {
  farm = this.accountService.selectedFarm;
  item?: CopulationModel;

  form = this.fb.group({
    copulationId: [null, [Validators.required]],
    impregnationDate: [null, [Validators.required]],
    numberOfLambs: [1, [Validators.required, Validators.min(1)]],
  });

  submitting = false;

  currentLanguage = this.languageService.onLangChange();

  constructor(
    private fb: FormBuilder,
    private service: ConfirmedCopulationService,
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
        this.form.get('copulationId')?.setValue(this.item.id);
        this.form.get('impregnationDate')?.setValue(dayjs(this.item.impregnationDate).startOf('day'));
      } else {
        this.router.navigate(['/', 'sheep-farm']);
      }
    });
  }

  confirmed(): void {
    if (this.form.valid) {
      this.submitting = true;

      this.service.confirmed(this.createModel()).subscribe(
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

  createModel(): ConfirmCopulationModel {
    const data: ConfirmCopulationModel = {
      copulationId: this.form.get('copulationId')?.value,
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
