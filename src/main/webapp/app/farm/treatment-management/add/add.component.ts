import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'app/core/util/toast.service';
import { AddTreatmentModel } from 'app/farm/models/treatment.model';
import { FullWarehouseModel } from 'app/farm/models/warehouse.model';
import { LookupEnum } from 'app/shared/lookup/lookup.enum';
import { LookupCategoryModel } from 'app/shared/models/lookup.model';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { first } from 'rxjs/operators';
import { AddTreatmentService } from './add.service';
import { ListCoopService } from '../../coop-management/list/list.service';
import { SimpleCoopModel } from 'app/farm/models/coop.model';
import { LanguageService } from 'app/shared/language/language.service';

@Component({
  selector: 'jhi-add-treatment',
  templateUrl: './add.component.html',
})
export class AddTreatmentComponent implements OnInit {
  warehouse?: FullWarehouseModel;

  form = this.fb.group({
    type: [null, [Validators.required]],
    secondDoseDate: [null, []],
    description: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
    allWarehouse: [{ value: true }, [Validators.required]],
    coops: [null, []],
  });

  treatmentTypes = [];
  coops: SimpleCoopModel[] = [];
  showCoops = false;

  submitting = false;

  currentLanguage = this.languageService.onLangChange();

  coopsDropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'name',
    allowSearchFilter: true,
    enableCheckAll: false,
  };

  todayDate: NgbDateStruct = this.calendar.getToday();

  constructor(
    private fb: FormBuilder,
    private service: AddTreatmentService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private languageService: LanguageService,
    private calendar: NgbCalendar,
    private listCoopService: ListCoopService
  ) {}

  ngOnInit(): void {
    this.route.data.pipe(first()).subscribe(data => {
      this.warehouse = data.warehouse;

      if (this.warehouse) {
        this.listCoopService.listSimpleCoop(this.warehouse.id).subscribe(result => (this.coops = result));
      }

      if (data.lookups?.find((x: LookupCategoryModel) => x.lookupName === LookupEnum.TreatmentType)) {
        this.treatmentTypes = data.lookups.find((x: LookupCategoryModel) => x.lookupName === LookupEnum.TreatmentType).lookupList;
      }
    });

    this.form.get('allWarehouse')?.valueChanges.subscribe(x => {
      if (x) {
        this.form.get('coops')?.setValidators([]);
        this.form.get('coops')?.updateValueAndValidity();
        this.showCoops = false;
      } else {
        this.form.get('coops')?.setValidators([Validators.required]);
        this.form.get('coops')?.updateValueAndValidity();
        this.showCoops = true;
      }
    });
  }

  add(): void {
    if (this.form.valid) {
      this.submitting = true;

      this.service.add(this.createAddFarmModel()).subscribe(
        () => {
          this.router.navigate(['/', 'farm', 'treatment', this.warehouse?.id]);
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
    }
  }

  createAddFarmModel(): AddTreatmentModel {
    if (this.warehouse) {
      const data: AddTreatmentModel = {
        warehouseId: this.warehouse.id,
        typeCode: this.form.get('type')?.value.code,
        secondDoseDate: this.form.get('secondDoseDate')?.value,
        coopIds: this.form.get('allWarehouse')?.value ? [] : this.getCoopIds(),
        description: this.form.get('description')?.value,
      };

      return data;
    } else {
      return {} as AddTreatmentModel;
    }
  }

  getCoopIds(): number[] {
    const a: SimpleCoopModel[] = this.form.get('coops')?.value;

    if (a.length > 0) {
      return a.map(x => x.id);
    } else {
      return [];
    }
  }

  private errorHandler(response: HttpErrorResponse): void {
    const error = response.error;
    this.toastService.error(error);
  }
}
