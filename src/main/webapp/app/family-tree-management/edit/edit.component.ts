import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'app/core/util/toast.service';
import { LanguageService } from 'app/shared/language/language.service';
import { first } from 'rxjs/operators';
import { EditFamilyTreeModel, FamilyTreeModel } from '../models/family-tree.model';
import { EditFamilyTreeService } from './edit.service';

@Component({
  selector: 'jhi-edit-family-tree',
  templateUrl: './edit.component.html',
})
export class EditFamilyTreeComponent implements OnInit {
  form = this.fb.group({
    id: [null, []],
    nameAr: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
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
  }

  edit(): void {
    if (this.form.valid) {
      this.submitting = true;

      this.service.edit(this.createEditFamilyTreeModel()).subscribe(
        () => {
          this.router.navigate(['/', 'family-tree-management']);
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
    };

    return data;
  }

  private errorHandler(response: HttpErrorResponse): void {
    const error = response.error;
    this.toastService.error(error);
  }
}
