import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { faUserMinus } from '@fortawesome/free-solid-svg-icons';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { ToastService } from 'app/core/util/toast.service';
import { LanguageService } from 'app/shared/language/language.service';
import { first } from 'rxjs/operators';
import { AddUserModel, FarmModel, RemoveUserModel } from '../models/farm.model';
import { EditFarmUserService } from './edit-farm-user.service';

@Component({
  selector: 'jhi-edit-farm-user',
  templateUrl: './edit-farm-user.component.html',
})
export class EditFarmUserComponent implements OnInit {
  faUserMinus = faUserMinus;

  form = this.fb.group({
    email: [null, [Validators.required, Validators.email]],
  });

  farm?: FarmModel;

  submitting = false;
  main = false;

  currentLanguage = this.languageService.onLangChange();

  account?: Account;

  constructor(
    private fb: FormBuilder,
    private service: EditFarmUserService,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private languageService: LanguageService,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.route.data.pipe(first()).subscribe(data => {
      this.farm = data.farm;
      this.setForm();
    });

    this.accountService.identity().subscribe(account => {
      if (account) {
        this.account = account;
        this.setForm();
      }
    });
  }

  setForm(): void {
    if (this.farm && this.account) {
      this.farm.farmUsers = this.farm.farmUsers.filter(x => x.userId !== this.account?.id);
    }
  }

  removeUser(userId: number): void {
    this.submitting = true;

    this.service.removeUser(this.createRemoveFarmUserModel(userId)).subscribe(
      result => {
        this.farm = result;
        this.setForm();
        this.toastService.success('global.message.successfullyRemoved');
        this.submitting = false;
      },
      error => {
        this.errorHandler(error);
        this.submitting = false;
      }
    );
  }

  addNormalUser(): void {
    if (this.form.valid) {
      this.submitting = true;
      this.main = false;

      this.service.addUser(this.createAddFarmUserModel('NORMAL')).subscribe(
        result => {
          this.farm = result;
          this.setForm();
          this.toastService.success('global.message.successfullyAdded');
          this.submitting = false;
          this.clearForm();
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

  addMainUser(): void {
    if (this.form.valid) {
      this.submitting = true;
      this.main = true;

      this.service.addUser(this.createAddFarmUserModel('MAIN')).subscribe(
        result => {
          this.farm = result;
          this.setForm();
          this.toastService.success('global.message.successfullyAdded');
          this.submitting = false;
          this.clearForm();
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

  clearForm(): void {
    this.form.get('email')?.setValue(null);
    this.form.get('email')?.markAsUntouched();
    this.form.get('email')?.updateValueAndValidity();
  }

  createAddFarmUserModel(userType: string): AddUserModel {
    if (this.farm) {
      const data: AddUserModel = {
        id: this.farm.id,
        userEmail: this.form.get('email')?.value,
        farmUserType: userType,
      };
      return data;
    } else {
      return {} as AddUserModel;
    }
  }

  createRemoveFarmUserModel(id: number): RemoveUserModel {
    if (this.farm) {
      const data: RemoveUserModel = {
        id: this.farm.id,
        userId: id,
      };
      return data;
    } else {
      return {} as RemoveUserModel;
    }
  }

  private errorHandler(response: HttpErrorResponse): void {
    const error = response.error;
    this.toastService.error(error);
  }
}
