import { DOCUMENT } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from 'app/core/util/toast.service';
import { ConfigurationService } from 'app/shared/configuration/configuration.service';
import { RecaptchaComponent } from 'ng-recaptcha';
import { LocalStorageService } from 'ngx-webstorage';
import { ForgotPasswordRequestModel, ResetPasswordRequestModel } from '../models/forgot-password.model';
import { ForgotPasswordService } from './forgot-password.service';

@Component({
  selector: 'jhi-forgot-password',
  templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent implements OnInit {
  form = this.fb.group({
    email: [null, [Validators.required, Validators.email]],
    captchaResponse: [null, []],
  });

  resetForm = this.fb.group({
    password: [
      null,
      [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(50),
        Validators.pattern('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$'),
      ],
    ],
    otp: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
  });

  siteKey = '';
  captchaEnabled = true;

  submitting = false;
  sent = false;

  constructor(
    private fb: FormBuilder,
    private forgotPasswordService: ForgotPasswordService,
    private router: Router,
    private configurationService: ConfigurationService,
    private toastService: ToastService,
    private localStorage: LocalStorageService,
    private translateService: TranslateService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.configurationService.getConfiguration().subscribe(result => {
      this.siteKey = result.captchaConfiguration.siteKeyInvisible;
      this.captchaEnabled = result.captchaConfiguration.enabled;
    });
  }

  submit(captchaRef: RecaptchaComponent): void {
    if (this.form.valid) {
      this.submitting = true;
      captchaRef.execute();
    } else {
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key)?.markAsTouched();
      });
    }
  }

  public resolved(captchaResponse: string): void {
    this.form.get('captchaResponse')?.setValue(captchaResponse);

    this.forgotPasswordService.forgotPassword(this.createForgotPasswordModel()).subscribe(
      () => {
        this.sent = true;
        this.submitting = false;
      },
      error => {
        this.errorHandler(error);
        this.submitting = false;
      }
    );
  }

  resetPassword(): void {
    if (this.resetForm.valid) {
      this.submitting = true;

      this.forgotPasswordService.resetPassword(this.createResetPasswordModel()).subscribe(
        account => {
          if (account) {
            this.changeLanguage(account.langKey);
          }

          this.submitting = false;
          this.router.navigate(['/']);
        },
        error => {
          this.errorHandler(error);
          this.submitting = false;
        }
      );
    } else {
      Object.keys(this.resetForm.controls).forEach(key => {
        this.resetForm.get(key)?.markAsTouched();
      });
    }
  }

  createForgotPasswordModel(): ForgotPasswordRequestModel {
    const data: ForgotPasswordRequestModel = {
      email: this.form.get('email')?.value,
      captchaResponse: this.form.get('captchaResponse')?.value,
    };

    return data;
  }

  createResetPasswordModel(): ResetPasswordRequestModel {
    const data: ResetPasswordRequestModel = {
      email: this.form.get('email')?.value,
      password: this.resetForm.get('password')?.value,
      otp: this.resetForm.get('otp')?.value,
    };

    return data;
  }

  private errorHandler(response: HttpErrorResponse): void {
    const error = response.error;
    this.toastService.error(error);
  }

  private changeLanguage(languageKey: string): void {
    this.localStorage.store('locale', languageKey);
    this.translateService.use(languageKey);

    const htmlTag = this.document.getElementsByTagName('html')[0];
    htmlTag.dir = languageKey === 'ar-ly' || languageKey === 'ur' ? 'rtl' : 'ltr';
    htmlTag.lang = languageKey;
  }
}
