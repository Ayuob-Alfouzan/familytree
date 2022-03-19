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

  @Input()
  personParent?: PersonModel;

  @Output() addedPerson = new EventEmitter<PersonModel>();

  page = 'VIEW';
  childGender = '';
  addingFather = false;

  resetToView(): void {
    this.page = 'VIEW';
  }

  viewAction(action: string): void {
    if (action === 'ADD_MALE_CHILD') {
      this.page = 'ADD';
      this.childGender = 'MALE';
      this.addingFather = false;
    } else if (action === 'ADD_FEMALE_CHILD') {
      this.page = 'ADD';
      this.childGender = 'FEMALE';
      this.addingFather = false;
    } else if (action === 'UPDATE') {
      this.page = 'UPDATE';
    } else if (action === 'ADD_FATHER') {
      this.page = 'ADD';
      this.childGender = 'MALE';
      this.addingFather = true;
    }
  }

  addAction(action: string): void {
    if (action === 'CANCEL') {
      this.page = 'VIEW';
    } else if (action === 'ADDED') {
      this.page = 'VIEW';
    }
  }

  updateAction(action: string): void {
    if (action === 'CANCEL') {
      this.page = 'VIEW';
    } else if (action === 'UPDATED') {
      this.page = 'VIEW';
    }
  }

  gotAddedPerson(person: PersonModel): void {
    this.addedPerson.emit(person);
  }

  gotUpdateedPerson(person: PersonModel): void {
    this.addedPerson.emit(person);
  }
}
