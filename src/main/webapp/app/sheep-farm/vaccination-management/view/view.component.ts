import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LanguageService } from 'app/shared/language/language.service';
import { AccountService } from 'app/core/auth/account.service';
import { first } from 'rxjs/operators';
import { LookupModel } from 'app/shared/models/lookup.model';
import { SheepVaccinationModel } from 'app/sheep-farm/models/vaccination.model';

@Component({
  selector: 'jhi-view-sheep-vaccination',
  templateUrl: './view.component.html',
})
export class ViewSheepVaccinationComponent implements OnInit {
  farm = this.accountService.selectedFarm;
  item?: SheepVaccinationModel;

  currentLanguage = this.languageService.onLangChange();

  ageDescription?: LookupModel;

  constructor(private languageService: LanguageService, private accountService: AccountService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.data.pipe(first()).subscribe(data => {
      this.item = data.item;
    });
  }
}
