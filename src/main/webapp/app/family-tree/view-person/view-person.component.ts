import { Component, EventEmitter, Input, Output } from '@angular/core';
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

  @Output() action = new EventEmitter<string>();

  currentLanguage = this.languageService.onLangChange();

  constructor(
    private router: Router,
    private toastService: ToastService,
    private languageService: LanguageService,
    private accountService: AccountService
  ) {}

  addChild(): void {
    if (this.person && this.person.gender.toLowerCase() === 'male') {
      this.action.emit('ADD_CHILD');
    }
  }
}
