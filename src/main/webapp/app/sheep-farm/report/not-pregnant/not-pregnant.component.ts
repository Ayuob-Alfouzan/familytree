import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { AccountService } from 'app/core/auth/account.service';
import { NotPregnantReportService } from './not-pregnant.service';
import { NgbdSortableHeaderDirective, SortEvent } from '../../sortable.directive';
import { LanguageService } from 'app/shared/language/language.service';

@Component({
  selector: 'jhi-not-pregnant-report',
  templateUrl: './not-pregnant.component.html',
})
export class NotPregnantReportComponent implements OnInit {
  @ViewChildren(NgbdSortableHeaderDirective) headers?: QueryList<NgbdSortableHeaderDirective>;
  faEye = faEye;

  currentLanguage = this.languageService.onLangChange();

  familyTree = this.accountService.selectedFarm;

  constructor(
    public service: NotPregnantReportService,
    private languageService: LanguageService,
    private router: Router,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    if (this.familyTree != null) {
      if (this.service.farmId && this.service.farmId !== +this.familyTree.farmId) {
        this.service.resetDefauleState();
      }

      this.service.farmId = +this.familyTree.farmId;
    } else {
      this.router.navigate(['/']);
    }
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
