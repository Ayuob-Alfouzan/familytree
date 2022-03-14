import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'app/core/util/toast.service';
import { PackageModel } from 'app/familyTree-management/models/subscription.model';
import { LanguageService } from 'app/shared/language/language.service';
import { first } from 'rxjs/operators';
import { SubscriptionService } from '../subscription.service';

@Component({
  selector: 'jhi-add-subscription',
  templateUrl: './add.component.html',
  styles: [
    `
      div.radio.selected div.card-widget {
        border: 2px solid #2fa4e7;
      }

      div.radio div.card-widget {
        border: 2px solid white;
      }
    `,
  ],
})
export class AddSubscriptionComponent implements OnInit {
  form = this.fb.group({
    packageId: [null, [Validators.required]],
  });

  loading = true;
  submitting = false;

  currentLanguage = this.languageService.onLangChange();

  familyTreeId?: number;

  packages?: PackageModel[];

  constructor(
    private fb: FormBuilder,
    private service: SubscriptionService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(first()).subscribe(paramMap => {
      const familyTreeId = paramMap.get('familyTreeId');

      if (familyTreeId != null) {
        this.familyTreeId = +familyTreeId;

        this.service.listSuitablePackages(this.familyTreeId).subscribe(
          result => {
            this.packages = result;
            this.loading = false;
          },
          () => {
            this.loading = false;
          }
        );
      }
    });
  }

  add(): void {
    if (this.form.valid && this.familyTreeId) {
      this.submitting = true;

      this.service.add(this.familyTreeId, this.form.get('packageId')?.value).subscribe(
        () => {
          this.service.subscriptionAction = undefined;
          this.router.navigate(['/', 'familyTree-management', 'subscription', this.familyTreeId]);
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

  selectPackage(id: number): void {
    this.form.get('packageId')?.setValue(id);
  }

  private errorHandler(response: HttpErrorResponse): void {
    const error = response.error;
    this.toastService.error(error);
  }
}
