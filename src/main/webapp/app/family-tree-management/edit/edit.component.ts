import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'app/core/util/toast.service';
import { LanguageService } from 'app/shared/language/language.service';
import { first } from 'rxjs/operators';
import { EditFamilyTreeModel, FamilyTreeModel } from '../models/familyTree.model';
import { EditFamilyTreeService } from './edit.service';

@Component({
  selector: 'jhi-edit-familyTree',
  templateUrl: './edit.component.html',
})
export class EditFamilyTreeComponent implements OnInit {
  form = this.fb.group({
    id: [null, []],
    nameAr: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
    nameEn: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
    location: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
    notRegisteredInVat: [false, [Validators.required]],
    vatNumber: [null, [Validators.required, Validators.minLength(15), Validators.maxLength(15)]],
  });

  familyTree?: FamilyTreeModel;

  submitting = false;

  currentLanguage = this.languageService.onLangChange();

  constructor(
    private fb: FormBuilder,
    private service: EditFamilyTreeService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    this.route.data.pipe(first()).subscribe(data => {
      this.setForm(data.familyTree);
    });
  }

  setForm(familyTreeData: FamilyTreeModel): void {
    this.familyTree = familyTreeData;

    this.form.get('id')?.setValue(familyTreeData.id);
    this.form.get('nameAr')?.setValue(familyTreeData.nameAr);
    this.form.get('nameEn')?.setValue(familyTreeData.nameEn);
    this.form.get('location')?.setValue(familyTreeData.location);

    if (familyTreeData.vatNumber) {
      this.form.get('vatNumber')?.setValue(familyTreeData.vatNumber);
    } else {
      this.form.get('notRegisteredInVat')?.setValue(true);
      this.form.get('vatNumber')?.setValidators([]);
      this.form.get('vatNumber')?.updateValueAndValidity();
    }

    this.form.get('notRegisteredInVat')?.valueChanges.subscribe(x => {
      if (x) {
        this.form.get('vatNumber')?.setValidators([]);
        this.form.get('vatNumber')?.updateValueAndValidity();
      } else {
        this.form.get('vatNumber')?.setValidators([Validators.required, Validators.minLength(15), Validators.maxLength(15)]);
        this.form.get('vatNumber')?.updateValueAndValidity();
      }
    });
  }

  edit(): void {
    if (this.form.valid) {
      this.submitting = true;

      this.service.edit(this.createEditFamilyTreeModel()).subscribe(
        () => {
          this.router.navigate(['/', 'familyTree-management']);
          this.submitting = false;
          this.toastService.success('global.message.successfullyEdited');
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

  createEditFamilyTreeModel(): EditFamilyTreeModel {
    const data: EditFamilyTreeModel = {
      id: this.form.get('id')?.value,
      nameAr: this.form.get('nameAr')?.value,
      nameEn: this.form.get('nameEn')?.value,
      location: this.form.get('location')?.value,
    };

    if (!this.form.get('notRegisteredInVat')?.value) {
      data.vatNumber = this.form.get('vatNumber')?.value;
    }

    return data;
  }

  private errorHandler(response: HttpErrorResponse): void {
    const error = response.error;
    this.toastService.error(error);
  }
}
