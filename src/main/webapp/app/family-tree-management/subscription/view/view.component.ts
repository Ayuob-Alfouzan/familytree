import { Component, OnInit, ViewChild } from '@angular/core';
import { SubscriptionService } from '../subscription.service';
import { LanguageService } from 'app/shared/language/language.service';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { ConfirmModalComponent } from 'app/shared/components/confirm-modal/confirm-modal.component';
import { ToastService } from 'app/core/util/toast.service';
import { SubscriptionModel } from 'app/familyTree-management/models/subscription.model';

@Component({
  selector: 'jhi-view-subscription',
  templateUrl: './view.component.html',
})
export class ViewSubscriptionComponent implements OnInit {
  @ViewChild('confirmDeleteModal') confirmDeleteModal?: ConfirmModalComponent;

  currentLanguage = this.languageService.onLangChange();

  subscription?: SubscriptionModel;

  cancelling = false;

  constructor(
    public service: SubscriptionService,
    private languageService: LanguageService,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.route.data.pipe(first()).subscribe(data => {
      this.subscription = data.subscription;
    });
  }

  cancel(id: number): void {
    this.confirmDeleteModal?.open(id);
  }

  confirmed(id: number): void {
    if (!this.subscription) {
      return;
    }

    this.cancelling = true;

    this.service.cancelUpgrade(this.subscription.familyTreeId, id).subscribe(
      result => {
        const index = this.subscription?.subscriptionUpgradeRequests.findIndex(x => x.id === id);

        if (index !== undefined && this.subscription) {
          this.subscription.subscriptionUpgradeRequests[index] = result;
        }

        this.cancelling = false;
        this.toastService.success('global.message.successfullyCancelled');
      },
      error => {
        this.service.errorHandler(error);
        this.cancelling = false;
      }
    );
  }
}
