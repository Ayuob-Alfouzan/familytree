import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { ToastService } from 'app/core/util/toast.service';
import { LanguageService } from 'app/shared/language/language.service';
import { UpdateAccountRequestModel } from '../models/profile.model';
import { ProfileService } from './profile.service';

@Component({
  selector: 'jhi-profile',
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  form = this.fb.group({
    firstName: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(15)]],
    lastName: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(15)]],
    langKey: [null, [Validators.required]],
  });

  changePasswordForm = this.fb.group({
    password: [
      null,
      [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(50),
        Validators.pattern('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$'),
      ],
    ],
  });

  updating = false;
  changing = false;

  currentLanguage = this.languageService.onLangChange();

  constructor(
    private fb: FormBuilder,
    private service: ProfileService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private languageService: LanguageService,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.accountService.identity().subscribe(
      account => {
        if (account) {
          this.setForm(account);
        } else {
          this.router.navigate(['/']);
        }
      },
      () => {
        this.router.navigate(['/']);
      }
    );
  }

  setForm(account: Account): void {
    this.form.get('firstName')?.setValue(account.firstName);
    this.form.get('lastName')?.setValue(account.lastName);
    this.form.get('langKey')?.setValue(account.langKey);
  }

  updateAccount(): void {
    if (this.form.valid) {
      this.updating = true;

      this.service.updateAccount(this.createUpdateAccountModel()).subscribe(
        result => {
          this.updating = false;
          this.toastService.success('global.message.successfullyUpdated');
          this.accountService.authenticate(result);
        },
        error => {
          this.errorHandler(error);
          this.updating = false;
        }
      );
    } else {
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key)?.markAsTouched();
      });
    }
  }

  changePassword(): void {
    if (this.changePasswordForm.valid) {
      this.changing = true;

      this.service.changePassword(this.changePasswordForm.get('password')?.value).subscribe(
        () => {
          this.changing = false;
          this.toastService.success('global.message.successfullyUpdated');
          this.changePasswordForm.reset();
        },
        error => {
          this.errorHandler(error);
          this.changing = false;
        }
      );
    } else {
      Object.keys(this.changePasswordForm.controls).forEach(key => {
        this.changePasswordForm.get(key)?.markAsTouched();
      });
    }
  }

  createUpdateAccountModel(): UpdateAccountRequestModel {
    const data: UpdateAccountRequestModel = {
      firstName: this.form.get('firstName')?.value,
      lastName: this.form.get('lastName')?.value,
      langKey: this.form.get('langKey')?.value,
    };

    return data;
  }

  private errorHandler(response: HttpErrorResponse): void {
    const error = response.error;
    this.toastService.error(error);
  }
}
