import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from 'app/core/auth/account.service';
import { ToastService } from 'app/core/util/toast.service';
import { LanguageService } from 'app/shared/language/language.service';
import { PersonModel } from '../models/family-tree.model';

@Component({
  selector: 'jhi-view-person',
  templateUrl: './view-person.component.html',
})
export class ViewPersonComponent {
  @Input()
  person?: PersonModel;

  currentLanguage = this.languageService.onLangChange();

  constructor(
    private router: Router,
    private toastService: ToastService,
    private languageService: LanguageService,
    private accountService: AccountService
  ) {}
}
