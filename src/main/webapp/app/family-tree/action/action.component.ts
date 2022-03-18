import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PersonModel } from '../models/family-tree.model';

@Component({
  selector: 'jhi-action',
  templateUrl: './action.component.html',
})
export class ActionComponent {
  _person?: PersonModel;
  get person(): PersonModel | undefined {
    return this._person;
  }
  @Input() set person(value: PersonModel | undefined) {
    this._person = value;
    this.resetToView();
  }

  @Output() addedPerson = new EventEmitter<PersonModel>();

  page = 'VIEW';

  resetToView(): void {
    this.page = 'VIEW';
  }

  viewAction(action: string): void {
    if (action === 'ADD_CHILD') {
      this.page = 'ADD';
    }
  }

  addAction(action: string): void {
    if (action === 'CANCEL') {
      this.page = 'VIEW';
    } else if (action === 'ADDED') {
      this.page = 'VIEW';
    }
  }

  gotAddedPerson(person: PersonModel): void {
    this.addedPerson.emit(person);
  }
}
