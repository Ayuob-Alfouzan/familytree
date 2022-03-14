import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { faEdit, faTrashAlt, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { ToastService } from 'app/core/util/toast.service';
import { ConfirmModalComponent } from 'app/shared/components/confirm-modal/confirm-modal.component';
import { ListOwnedFamilyTreeService } from './list-owned.service';
import { NgbdSortableHeaderDirective, SortEvent } from '../sortable.directive';
import { LanguageService } from 'app/shared/language/language.service';
import { AccountService } from 'app/core/auth/account.service';

@Component({
  selector: 'jhi-list-owned-family-tree',
  templateUrl: './list-owned.component.html',
})
export class ListOwnedFamilyTreeComponent implements OnInit {
  @ViewChild('confirmDeleteModal') confirmDeleteModal?: ConfirmModalComponent;
  @ViewChildren(NgbdSortableHeaderDirective) headers?: QueryList<NgbdSortableHeaderDirective>;
  faEdit = faEdit;
  faTrashAlt = faTrashAlt;
  faUserPlus = faUserPlus;

  currentLanguage = this.languageService.onLangChange();
  deleting = false;

  constructor(
    public service: ListOwnedFamilyTreeService,
    private languageService: LanguageService,
    private toastService: ToastService,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.service.load();
  }

  delete(id: number): void {
    this.deleting = true;
    this.confirmDeleteModal?.open(id);
  }

  confirmed(id: number): void {
    this.service.delete(id).subscribe(
      () => {
        this.service.load();
        this.deleting = false;
        this.toastService.success('global.message.successfullyRemoved');
        this.accountService.identity(true).subscribe();
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
}
