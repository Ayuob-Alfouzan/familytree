import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { faTrashAlt, faCopy } from '@fortawesome/free-solid-svg-icons';
import { TokenService } from './token.service';
import { NgbdSortableHeaderDirective, SortEvent } from '../sortable.directive';
import { LanguageService } from 'app/shared/language/language.service';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { ToastService } from 'app/core/util/toast.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmModalComponent } from 'app/shared/components/confirm-modal/confirm-modal.component';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'jhi-list-token',
  templateUrl: './token.component.html',
})
export class TokenComponent implements OnInit {
  @ViewChild('confirmDeleteModal') confirmDeleteModal?: ConfirmModalComponent;
  @ViewChildren(NgbdSortableHeaderDirective) headers?: QueryList<NgbdSortableHeaderDirective>;
  faTrashAlt = faTrashAlt;
  faCopy = faCopy;

  currentLanguage = this.languageService.onLangChange();

  submitting = false;
  deleting = false;

  constructor(
    public service: TokenService,
    private languageService: LanguageService,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private clipboard: Clipboard
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(first()).subscribe(paramMap => {
      const familyTreeId = paramMap.get('familyTreeId');

      if (familyTreeId != null) {
        if (this.service.familyTreeId && this.service.familyTreeId !== +familyTreeId) {
          this.service.resetDefauleState();
        }

        this.service.familyTreeId = +familyTreeId;
      }
    });
  }

  copy(url: string): void {
    this.clipboard.copy(url);
    this.toastService.success('familyTree.token.successfullyCopied');
  }

  add(): void {
    this.submitting = true;

    this.service.add({ familyTreeId: this.service.familyTreeId }).subscribe(
      () => {
        this.service.load();
        this.submitting = false;
        this.toastService.success('global.message.successfullyAdded');
      },
      error => {
        this.errorHandler(error);
        this.submitting = false;
      }
    );
  }

  delete(id: number): void {
    this.deleting = true;
    this.confirmDeleteModal?.open(id);
  }

  confirmed(id: number): void {
    this.service.delete({ familyTreeId: this.service.familyTreeId, id }).subscribe(
      () => {
        this.service.load();
        this.deleting = false;
        this.toastService.success('global.message.successfullyRemoved');
      },
      error => {
        this.service.errorHandler(error);
        this.deleting = false;
      }
    );
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

  private errorHandler(response: HttpErrorResponse): void {
    const error = response.error;
    this.toastService.error(error);
  }
}
