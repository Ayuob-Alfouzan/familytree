import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'app/core/util/toast.service';
import { PackageModel } from 'app/farm-management/models/subscription.model';
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

  farmId?: number;

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
      const farmId = paramMap.get('farmId');

      if (farmId != null) {
        this.farmId = +farmId;

        this.service.listSuitablePackages(this.farmId).subscribe(
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
    if (this.form.valid && this.farmId) {
      this.submitting = true;

      this.service.add(this.farmId, this.form.get('packageId')?.value).subscribe(
        () => {
          this.service.subscriptionAction = undefined;
          this.router.navigate(['/', 'farm-management', 'subscription', this.farmId]);
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
