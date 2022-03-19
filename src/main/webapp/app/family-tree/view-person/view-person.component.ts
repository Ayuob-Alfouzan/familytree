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

  @Input()
  personParent?: PersonModel;

  @Output() action = new EventEmitter<string>();

  currentLanguage = this.languageService.onLangChange();

  constructor(
    private router: Router,
    private toastService: ToastService,
    private languageService: LanguageService,
    private accountService: AccountService
  ) {}

  addChild(childGender: string): void {
    if (this.person && this.person.gender.toLowerCase() === 'male') {
      if (childGender === 'MALE') {
        this.action.emit('ADD_MALE_CHILD');
      } else if (childGender === 'FEMALE') {
        this.action.emit('ADD_FEMALE_CHILD');
      }
    }
  }

  addFather(): void {
    if (this.person && !this.personParent) {
      this.action.emit('ADD_FATHER');
    }
  }

  update(): void {
    if (this.person) {
      this.action.emit('UPDATE');
    }
  }
}
