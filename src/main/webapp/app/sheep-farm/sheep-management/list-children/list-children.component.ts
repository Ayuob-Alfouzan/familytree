import { Component, Input, OnChanges, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { AccountService } from 'app/core/auth/account.service';
import { ListSheepChildrenService } from './list-children.service';
import { NgbdSortableHeaderDirective, SortEvent } from '../../sortable.directive';
import { first } from 'rxjs/operators';
import { LookupCategoryModel } from 'app/shared/models/lookup.model';
import { LookupEnum } from 'app/shared/lookup/lookup.enum';
import { LanguageService } from 'app/shared/language/language.service';
import { SheepModel } from '../../models/sheep.model';

@Component({
  selector: 'jhi-list-sheep-children',
  templateUrl: './list-children.component.html',
})
export class ListSheepChildrenComponent implements OnInit, OnChanges {
  @Input() parent?: SheepModel;
  @ViewChildren(NgbdSortableHeaderDirective) headers?: QueryList<NgbdSortableHeaderDirective>;
  faEye = faEye;

  currentLanguage = this.languageService.onLangChange();

  farm = this.accountService.selectedFarm;
  isMain = false;

  sheepStatuses = [];
  sheepTypes = [];
  sheepCategories = [];

  constructor(
    public service: ListSheepChildrenService,
    private languageService: LanguageService,
    private accountService: AccountService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.data.pipe(first()).subscribe(data => {
      if (data.lookups?.find((x: LookupCategoryModel) => x.lookupName === LookupEnum.SheepType)) {
        this.sheepTypes = data.lookups.find((x: LookupCategoryModel) => x.lookupName === LookupEnum.SheepType).lookupList;
      }

      if (data.lookups?.find((x: LookupCategoryModel) => x.lookupName === LookupEnum.SheepStatus)) {
        this.sheepStatuses = data.lookups.find((x: LookupCategoryModel) => x.lookupName === LookupEnum.SheepStatus).lookupList;
      }

      if (data.lookups?.find((x: LookupCategoryModel) => x.lookupName === LookupEnum.SheepCategory)) {
        this.sheepCategories = data.lookups.find((x: LookupCategoryModel) => x.lookupName === LookupEnum.SheepCategory).lookupList;
      }
    });

    if (this.farm != null) {
      this.service.farmId = +this.farm.farmId;
      this.isMain = this.farm.type.code === 'MAIN';
    }
  }

  ngOnChanges(): void {
    if (this.parent != null) {
      if (this.parent.gender.code === 'FEMALE') {
        if (!this.service.motherId || this.service.motherId !== this.parent.id) {
          this.service.resetDefauleState();
        }

        if (this.farm != null && !this.service.farmId) {
          this.service.farmId = +this.farm.farmId;
        }
        this.service.motherId = this.parent.id;
      } else if (this.parent.gender.code === 'MALE') {
        if (!this.service.fatherId || this.service.fatherId !== this.parent.id) {
          this.service.resetDefauleState();
        }

        if (this.farm != null && !this.service.farmId) {
          this.service.farmId = +this.farm.farmId;
        }
        this.service.fatherId = this.parent.id;
      }
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
