import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { ToastService } from 'app/core/util/toast.service';
import { ConfirmModalComponent } from 'app/shared/components/confirm-modal/confirm-modal.component';
import { ListFarmService } from './list.service';
import { NgbdSortableHeaderDirective, SortEvent } from '../sortable.directive';
import { LanguageService } from 'app/shared/language/language.service';
import { AccountService } from 'app/core/auth/account.service';

@Component({
  selector: 'jhi-list-farm',
  templateUrl: './list.component.html',
})
export class ListFarmComponent implements OnInit {
  @ViewChild('confirmDeleteModal') confirmDeleteModal?: ConfirmModalComponent;
  @ViewChildren(NgbdSortableHeaderDirective) headers?: QueryList<NgbdSortableHeaderDirective>;
  faTrashAlt = faTrashAlt;

  currentLanguage = this.languageService.onLangChange();
  removing = false;

  constructor(
    public service: ListFarmService,
    private languageService: LanguageService,
    private toastService: ToastService,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.service.load();
  }

  remove(id: number): void {
    this.removing = true;
    this.confirmDeleteModal?.open(id);
  }

  confirmed(id: number): void {
    this.service.remove(id).subscribe(
      () => {
        this.service.load();
        this.removing = false;
        this.toastService.success('global.message.successfullyRemoved');
        this.accountService.identity(true).subscribe();
      },
      error => {
        this.service.errorHandler(error);
        this.removing = false;
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
}
