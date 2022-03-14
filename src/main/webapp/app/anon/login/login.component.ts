import { DOCUMENT } from '@angular/common';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from 'app/core/util/toast.service';
import { ConfigurationService } from 'app/shared/configuration/configuration.service';
import { RecaptchaComponent } from 'ng-recaptcha';
import { LocalStorageService } from 'ngx-webstorage';
import { LoginModel } from '../models/login.model';
import { LoginService } from './login.service';

@Component({
  selector: 'jhi-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  form = this.fb.group({
    email: [null, [Validators.required, Validators.email]],
    password: [null, [Validators.required]],
    captchaResponse: [null, []],
  });

  siteKey = '';
  captchaEnabled = true;

  submitting = false;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
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

  login(captchaRef: RecaptchaComponent): void {
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

    this.loginService.login(this.createLoginModel()).subscribe(
      account => {
        if (account) {
          this.changeLanguage(account.langKey);
        }

        this.router.navigate(['/']);
        this.submitting = false;
      },
      error => {
        this.errorHandler(error);
        this.submitting = false;
      }
    );
  }

  createLoginModel(): LoginModel {
    const data: LoginModel = {
      email: this.form.get('email')?.value,
      password: this.form.get('password')?.value,
      rememberMe: true,
      captchaResponse: this.form.get('captchaResponse')?.value,
    };

    return data;
  }

  private errorHandler(response: HttpErrorResponse): void {
    const error = response.error;

    if (error.status === HttpStatusCode.Unauthorized) {
      error['message'] = {
        ar: 'البريد الإلكتروني و كلمة المرور غير متطابقة',
        en: 'Email and password does not match',
      };
    }

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
