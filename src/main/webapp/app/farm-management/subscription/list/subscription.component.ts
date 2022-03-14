import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { SubscriptionService } from '../subscription.service';
import { NgbdSortableHeaderDirective, SortEvent } from '../../sortable.directive';
import { LanguageService } from 'app/shared/language/language.service';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { LookupCategoryModel } from 'app/shared/models/lookup.model';
import { LookupEnum } from 'app/shared/lookup/lookup.enum';
import { ConfirmModalComponent } from 'app/shared/components/confirm-modal/confirm-modal.component';
import { ToastService } from 'app/core/util/toast.service';

@Component({
  selector: 'jhi-list-subscription',
  templateUrl: './subscription.component.html',
})
export class SubscriptionComponent implements OnInit {
  @ViewChild('confirmDeleteModal') confirmDeleteModal?: ConfirmModalComponent;
  @ViewChildren(NgbdSortableHeaderDirective) headers?: QueryList<NgbdSortableHeaderDirective>;
  faEye = faEye;

  currentLanguage = this.languageService.onLangChange();

  subscriptionStatuses = [];

  cancelling = false;
  cancelMessage = 'farm.subscription.cancelActiveMessage';

  constructor(
    public service: SubscriptionService,
    private languageService: LanguageService,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(first()).subscribe(paramMap => {
      const farmId = paramMap.get('farmId');

      if (farmId != null) {
        if (this.service.farmId && this.service.farmId !== +farmId) {
          this.service.resetDefauleState();
        }
        this.service.farmId = +farmId;

        this.setSubscriptionActions();
      }
    });

    this.route.data.pipe(first()).subscribe(data => {
      if (data.lookups?.find((x: LookupCategoryModel) => x.lookupName === LookupEnum.SubscriptionStatus)) {
        this.subscriptionStatuses = data.lookups.find(
          (x: LookupCategoryModel) => x.lookupName === LookupEnum.SubscriptionStatus
        ).lookupList;
      }
    });
  }

  setSubscriptionActions(): void {
    this.service.getSubscriptionAction().subscribe(result => {
      this.service.subscriptionAction = result;
    });
  }

  onSort({ column, direction }: SortEvent): void {
    // resetting other headers
    this.headers?.forEach(header => {
      if (header.jhiSortable !== column) {
        header.direction = '';
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }

  cancel(id: number, statusCode: string): void {
    if (statusCode === 'ACTIVE') {
      this.cancelMessage = 'farm.subscription.cancelActiveMessage';
    } else {
      this.cancelMessage = 'farm.subscription.cancelWaitingMessage';
    }

    this.confirmDeleteModal?.open(id);
  }

  confirmed(id: number): void {
    this.cancelling = true;

    this.service.cancel(this.service.farmId, id).subscribe(
      () => {
        this.service.subscriptionAction = undefined;
        this.setSubscriptionActions();
        this.service.load();
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
