import { Component, OnInit } from '@angular/core';
import { LanguageService } from 'app/shared/language/language.service';
import { PricingModel } from '../models/pricing.model';
import { PricingService } from './pricing.service';

@Component({
  selector: 'jhi-pricing',
  templateUrl: './pricing.component.html',
})
export class PricingComponent implements OnInit {
  loading = true;
  list?: PricingModel[];

  currentLanguage = this.languageService.onLangChange();

  constructor(private service: PricingService, private languageService: LanguageService) {}

  ngOnInit(): void {
    this.service.listPackages().subscribe(
      result => {
        this.list = result;
        this.loading = false;
      },
      () => {
        this.loading = false;
      }
    );
  }
}
