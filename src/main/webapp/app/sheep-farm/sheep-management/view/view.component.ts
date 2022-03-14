import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LanguageService } from 'app/shared/language/language.service';
import { AccountService } from 'app/core/auth/account.service';
import { SheepModel, SheepStatusModel } from 'app/sheep-farm/models/sheep.model';
import { first } from 'rxjs/operators';
import { ListGestationComponent } from '../gestation/list/list.component';
import { LookupModel } from 'app/shared/models/lookup.model';
import { ViewSheepService } from './view.service';

@Component({
  selector: 'jhi-view-sheep',
  templateUrl: './view.component.html',
})
export class ViewSheepComponent implements OnInit {
  @ViewChild(ListGestationComponent) listGestationComponent?: ListGestationComponent;

  farm = this.accountService.selectedFarm;
  item?: SheepModel;
  itemStatus?: SheepStatusModel;

  currentLanguage = this.languageService.onLangChange();

  ageDescription?: LookupModel;

  constructor(
    private languageService: LanguageService,
    private accountService: AccountService,
    private route: ActivatedRoute,
    private service: ViewSheepService
  ) {
    route.data.subscribe(data => {
      this.item = data.item;
      this.setAgeDescription();

      if (this.item && this.item.type.code === 'PREGNANT') {
        this.service.getStatus(this.item.id).subscribe(result => {
          this.itemStatus = result;
        });
      }
    });
  }

  ngOnInit(): void {
    this.route.data.pipe(first()).subscribe(data => {
      this.item = data.item;
      this.setAgeDescription();

      if (this.item && this.item.type.code === 'PREGNANT') {
        this.service.getStatus(this.item.id).subscribe(result => {
          this.itemStatus = result;
        });
      }
    });
  }

  updateGestation(event: any): void {
    if (event) {
      this.listGestationComponent?.refresh();
    }
  }

  setAgeDescription(): void {
    let ageInMonths = 0;
    if (this.item) {
      if (this.item.ageInYears) {
        ageInMonths += this.item.ageInYears * 12;
      }
      if (this.item.ageInMonths) {
        ageInMonths += this.item.ageInMonths;
      }
    }

    switch (true) {
      case ageInMonths >= 30:
        this.ageDescription = { ar: 'تام', en: '', ur: '', category: '', code: '', recordActivity: true };
        break;
      case ageInMonths >= 24:
        this.ageDescription = { ar: 'سديس', en: '', ur: '', category: '', code: '', recordActivity: true };
        break;
      case ageInMonths >= 18:
        this.ageDescription = { ar: 'رباع', en: '', ur: '', category: '', code: '', recordActivity: true };
        break;
      case ageInMonths >= 12:
        this.ageDescription = { ar: 'ثني', en: '', ur: '', category: '', code: '', recordActivity: true };
        break;
      case ageInMonths >= 6:
        this.ageDescription = { ar: 'جذع', en: '', ur: '', category: '', code: '', recordActivity: true };
        break;
      case ageInMonths >= 3:
        this.ageDescription = { ar: 'مفطوم', en: '', ur: '', category: '', code: '', recordActivity: true };
        break;
      default:
        this.ageDescription = { ar: 'بهم', en: '', ur: '', category: '', code: '', recordActivity: true };
    }
  }
}
