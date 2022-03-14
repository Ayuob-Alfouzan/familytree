import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'app/core/util/toast.service';
import { first } from 'rxjs/operators';
import { AddCopulationService } from './add.service';
import { LanguageService } from 'app/shared/language/language.service';
import { AccountService } from 'app/core/auth/account.service';
import { SheepModel, SimpleSheepModel } from 'app/sheep-familyTree/models/sheep.model';
import { AddCopulationModel } from 'app/sheep-familyTree/models/copulation.model';
import * as dayjs from 'dayjs';

@Component({
  selector: 'jhi-add-copulation',
  templateUrl: './add.component.html',
})
export class AddCopulationComponent implements OnInit {
  familyTree = this.accountService.selectedFarm;
  item?: SheepModel;

  form = this.fb.group({
    ewe: [null, [Validators.required]],
    ram: [null, [Validators.required]],
    impregnationDate: [dayjs().startOf('day'), [Validators.required]],
  });

  submitting = false;

  currentLanguage = this.languageService.onLangChange();

  rams: SimpleSheepModel[] = [];
  ewes: SimpleSheepModel[] = [];

  constructor(
    private fb: FormBuilder,
    private service: AddCopulationService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private languageService: LanguageService,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.route.data.pipe(first()).subscribe(data => {
      this.item = data.item;

      if (this.item && this.familyTree) {
        let listType: string;
        if (this.item.gender.code === 'FEMALE') {
          this.form.get('ewe')?.setValue(this.item);
          listType = 'MALE';
        } else {
          this.form.get('ram')?.setValue(this.item);
          listType = 'FEMALE';
        }

        this.service.listSimple(this.familyTree.farmId, listType === 'MALE' ? ['RAM'] : ['EWE', 'PREGNANT', 'LAMBED']).subscribe(
          result => {
            if (listType === 'FEMALE') {
              this.ewes = result;
            } else {
              this.rams = result;
            }
          },
          error => {
            this.errorHandler(error);
          }
        );
      } else {
        this.router.navigate(['/', 'sheep-familyTree']);
      }
    });
  }

  add(): void {
    if (this.form.valid) {
      this.submitting = true;

      this.service.add(this.createAddModel()).subscribe(
        () => {
          this.router.navigate(['/', 'sheep-familyTree', 'view', this.item?.id]);
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

  createAddModel(): AddCopulationModel {
    if (this.familyTree) {
      const data: AddCopulationModel = {
        eweId: this.form.get('ewe')?.value.id,
        ramId: this.form.get('ram')?.value.id,
        impregnationDate: this.form.get('impregnationDate')?.value,
      };

      return data;
    } else {
      return {} as AddCopulationModel;
    }
  }

  private errorHandler(response: HttpErrorResponse): void {
    const error = response.error;
    this.toastService.error(error);
  }
}
