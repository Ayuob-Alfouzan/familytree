import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from 'app/core/util/toast.service';
import { ConfigurationService } from 'app/shared/configuration/configuration.service';
import { RecaptchaComponent } from 'ng-recaptcha';
import { ActivationRequestModel, RegisterRequestModel, ResendRequestModel } from '../models/registration.model';
import { RegisterService } from './register.service';

@Component({
  selector: 'jhi-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {
  form = this.fb.group({
    firstName: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(15)]],
    lastName: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(15)]],
    email: [null, [Validators.required, Validators.email, Validators.maxLength(255)]],
    captchaResponse: [null, []],
    agree: [false, Validators.requiredTrue],
    password: [
      null,
      [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(50),
        Validators.pattern('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$'),
      ],
    ],
    language: ['ar-ly', [Validators.required]],
  });

  activationForm = this.fb.group({
    otp: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
  });

  siteKey = '';
  captchaEnabled = true;

  submitting = false;

  registered = false;

  timeLeft = 120;
  interval?: NodeJS.Timeout;
  canResend = false;
  resending = false;

  constructor(
    private fb: FormBuilder,
    private registerService: RegisterService,
    private router: Router,
    private configurationService: ConfigurationService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.configurationService.getConfiguration().subscribe(result => {
      this.siteKey = result.captchaConfiguration.siteKeyInvisible;
      this.captchaEnabled = result.captchaConfiguration.enabled;
    });
  }

  register(captchaRef: RecaptchaComponent): void {
    if (this.form.valid) {
      this.submitting = true;
      captchaRef.execute();
    } else {
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key)?.markAsTouched();
      });
    }
  }

  resolved(captchaResponse: string): void {
    this.form.get('captchaResponse')?.setValue(captchaResponse);

    this.registerService.register(this.createRegisterationModel()).subscribe(
      () => {
        this.submitting = false;
        this.registered = true;
        this.startTimer();
      },
      error => {
        this.submitting = false;
        this.errorHandler(error);
      }
    );
  }

  createRegisterationModel(): RegisterRequestModel {
    const data: RegisterRequestModel = {
      firstName: this.form.get('firstName')?.value,
      lastName: this.form.get('lastName')?.value,
      email: this.form.get('email')?.value,
      password: this.form.get('password')?.value,
      language: this.form.get('language')?.value,
      captchaResponse: this.form.get('captchaResponse')?.value,
    };

    return data;
  }

  activateAccount(): void {
    if (this.activationForm.valid) {
      this.submitting = true;

      this.registerService.activateAccount(this.createActivationModel()).subscribe(
        () => {
          this.submitting = false;
          this.router.navigate(['/']);
        },
        error => {
          this.submitting = false;
          this.errorHandler(error);
        }
      );
    } else {
      Object.keys(this.activationForm.controls).forEach(key => {
        this.activationForm.get(key)?.markAsTouched();
      });
    }
  }

  createActivationModel(): ActivationRequestModel {
    const data: ActivationRequestModel = {
      email: this.form.get('email')?.value,
      otp: this.activationForm.get('otp')?.value,
    };

    return data;
  }

  createResendModel(): ResendRequestModel {
    const data: ResendRequestModel = {
      email: this.form.get('email')?.value,
    };

    return data;
  }

  resendActivationEmail(): void {
    if (this.canResend) {
      this.resending = true;

      this.registerService.resendActivationOtp(this.createResendModel()).subscribe(
        () => {
          this.reinitalizeTimer();
          this.resending = false;
        },
        error => {
          this.resending = false;
          this.errorHandler(error);
        }
      );
    }
  }

  startTimer(): void {
    this.timeLeft = 120;

    this.interval = setInterval(() => {
      if (this.timeLeft > 1) {
        this.timeLeft--;
      } else {
        this.canResend = true;
      }
    }, 1000);
  }

  reinitalizeTimer(): void {
    this.canResend = false;
    this.interval = undefined;
    this.timeLeft = 0;

    this.startTimer();
  }

  private errorHandler(response: HttpErrorResponse): void {
    const error = response.error;
    this.toastService.error(error);
  }
}
