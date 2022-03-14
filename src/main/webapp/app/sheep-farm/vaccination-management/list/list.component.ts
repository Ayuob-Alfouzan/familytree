import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faEye, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { AccountService } from 'app/core/auth/account.service';
import { ToastService } from 'app/core/util/toast.service';
import { ConfirmModalComponent } from 'app/shared/components/confirm-modal/confirm-modal.component';
import { ListSheepVaccinationService } from './list.service';
import { NgbdSortableHeaderDirective, SortEvent } from '../../sortable.directive';
import { first } from 'rxjs/operators';
import { LookupCategoryModel } from 'app/shared/models/lookup.model';
import { LookupEnum } from 'app/shared/lookup/lookup.enum';
import { LanguageService } from 'app/shared/language/language.service';

@Component({
  selector: 'jhi-list-sheep-vaccination',
  templateUrl: './list.component.html',
})
export class ListSheepVaccinationComponent implements OnInit {
  @ViewChild('confirmDeleteModal') confirmDeleteModal?: ConfirmModalComponent;
  @ViewChildren(NgbdSortableHeaderDirective) headers?: QueryList<NgbdSortableHeaderDirective>;
  faTrashAlt = faTrashAlt;
  faEye = faEye;

  currentLanguage = this.languageService.onLangChange();
  deleting = false;

  familyTree = this.accountService.selectedFarm;
  isMain = false;

  sheepVaccinationTypes = [];

  constructor(
    public service: ListSheepVaccinationService,
    private languageService: LanguageService,
    private toastService: ToastService,
    private router: Router,
    private accountService: AccountService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (this.familyTree != null) {
      if (this.service.farmId && this.service.farmId !== +this.familyTree.farmId) {
        this.service.resetDefauleState();
      }

      this.service.farmId = +this.familyTree.farmId;

      if (this.familyTree.type.code === 'MAIN') {
        this.isMain = true;
      }
    } else {
      this.router.navigate(['/']);
    }

    this.route.data.pipe(first()).subscribe(data => {
      if (data.lookups?.find((x: LookupCategoryModel) => x.lookupName === LookupEnum.SheepVaccinationType)) {
        this.sheepVaccinationTypes = data.lookups.find(
          (x: LookupCategoryModel) => x.lookupName === LookupEnum.SheepVaccinationType
        ).lookupList;
      }
    });
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
