import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faUserMinus, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { ToastService } from 'app/core/util/toast.service';
import { FarmModel, FarmUserModel } from '../../../farm-management/models/farm.model';
import { EditWarehouseModel, FullWarehouseModel, ManageWarehouseUserModel } from 'app/farm/models/warehouse.model';
import { LanguageService } from 'app/shared/language/language.service';
import { first } from 'rxjs/operators';
import { EditWarehouseService } from './edit-warehouse.service';

@Component({
  selector: 'jhi-edit-warehouse',
  templateUrl: './edit-warehouse.component.html',
})
export class EditWarehouseComponent implements OnInit {
  form = this.fb.group({
    number: [null, [Validators.required]],
  });

  faUserMinus = faUserMinus;
  faUserPlus = faUserPlus;

  farm?: FarmModel;
  warehouse?: FullWarehouseModel;

  submitting = false;
  editing = false;

  currentLanguage = this.languageService.onLangChange();

  constructor(
    private fb: FormBuilder,
    private service: EditWarehouseService,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private languageService: LanguageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.data.pipe(first()).subscribe(data => {
      this.warehouse = data.warehouse;
      this.farm = data.farm;
      this.setup();
    });
  }

  setup(): void {
    if (this.farm && this.warehouse) {
      const normalUsers: FarmUserModel[] = [];

      this.farm.farmUsers.forEach(x => {
        if (x.type.code === 'NORMAL') {
          normalUsers.push(x);
        }
      });

      this.farm.farmUsers = normalUsers;

      this.farm.farmUsers.forEach(x => {
        const found = this.warehouse?.warehouseUsers.find(xx => xx.userId === x.userId);

        if (found) {
          x.added = true;
        } else {
          x.added = false;
        }
      });

      this.form.get('number')?.setValue(this.warehouse.number);
    }
  }

  edit(): void {
    if (this.form.valid) {
      this.editing = true;

      this.service.edit(this.createEditModel()).subscribe(
        () => {
          this.editing = false;
          this.toastService.success('global.message.successfullyUpdated');
          this.router.navigate(['/', 'farm', 'dashboard']);
        },
        error => {
          this.errorHandler(error);
          this.editing = false;
        }
      );
    } else {
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key)?.markAsTouched();
      });
    }
  }

  createEditModel(): EditWarehouseModel {
    if (this.farm && this.warehouse) {
      return {
        farmId: this.farm.id,
        warehouseId: this.warehouse.id,
        number: this.form.get('number')?.value,
      } as EditWarehouseModel;
    } else {
      return {} as EditWarehouseModel;
    }
  }

  removeUser(userId: number): void {
    this.submitting = true;

    this.service.removeUser(this.createManageWarehouseUserModel(userId)).subscribe(
      result => {
        this.warehouse = result;
        this.setup();
        this.toastService.success('global.message.successfullyRemoved');
        this.submitting = false;
      },
      error => {
        this.errorHandler(error);
        this.submitting = false;
      }
    );
  }

  addUser(userId: number): void {
    this.submitting = true;

    this.service.addUser(this.createManageWarehouseUserModel(userId)).subscribe(
      result => {
        this.warehouse = result;
        this.setup();
        this.toastService.success('global.message.successfullyAdded');
        this.submitting = false;
      },
      error => {
        this.errorHandler(error);
        this.submitting = false;
      }
    );
  }

  createManageWarehouseUserModel(id: number): ManageWarehouseUserModel {
    if (this.farm && this.warehouse) {
      const data: ManageWarehouseUserModel = {
        farmId: this.farm.id,
        warehouseId: this.warehouse.id,
        userId: id,
      };
      return data;
    } else {
      return {} as ManageWarehouseUserModel;
    }
  }

  private errorHandler(response: HttpErrorResponse): void {
    const error = response.error;
    this.toastService.error(error);
  }
}
