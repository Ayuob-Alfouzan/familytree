import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'app/core/util/toast.service';
import { PackageModel } from 'app/familyTree-management/models/subscription.model';
import { LanguageService } from 'app/shared/language/language.service';
import { first } from 'rxjs/operators';
import { SubscriptionService } from '../subscription.service';

@Component({
  selector: 'jhi-renew-subscription',
  templateUrl: './renew.component.html',
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
export class RenewSubscriptionComponent implements OnInit {
  submitting = false;

  currentLanguage = this.languageService.onLangChange();

  familyTreeId = 0;
  subscriptionId = 0;
  package?: PackageModel;

  constructor(
    private service: SubscriptionService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(first()).subscribe(paramMap => {
      const familyTreeId = paramMap.get('familyTreeId');
      const subscriptionId = paramMap.get('subscriptionId');

      if (familyTreeId != null && subscriptionId != null) {
        this.familyTreeId = +familyTreeId;
        this.subscriptionId = +subscriptionId;
      }
    });

    this.route.data.pipe(first()).subscribe(data => {
      this.package = data.package;
    });
  }

  renew(): void {
    this.submitting = true;

    this.service.renew(this.familyTreeId, this.subscriptionId).subscribe(
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
  }

  private errorHandler(response: HttpErrorResponse): void {
    const error = response.error;
    this.toastService.error(error);
  }
}
