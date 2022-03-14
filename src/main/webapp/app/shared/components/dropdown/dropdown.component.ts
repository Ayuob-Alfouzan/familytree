import { Component, forwardRef, Input, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { LanguageService } from 'app/shared/language/language.service';
import { LookupModel } from 'app/shared/models/lookup.model';

@Component({
  selector: 'jhi-dropdown',
  templateUrl: './dropdown.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownComponent),
      multi: true,
    },
  ],
})
export class DropdownComponent implements ControlValueAccessor {
  @Input()
  placeholder = 'global.select';

  @Input()
  data?: LookupModel[];

  @Output() changed = new EventEmitter<LookupModel>();

  selectedOption?: LookupModel;

  onChange?: (fn: any) => {};

  currentLanguage = this.languageService.onLangChange();

  _onTouched?: (fn: any) => {};

  constructor(private languageService: LanguageService) {}

  writeValue(value: LookupModel): void {
    this.selectedOption = value;
  }

  registerOnChange(fn: (_: any) => {}): void {
    this.onChange = fn;
  }

  changeSelectedOption(option: LookupModel): void {
    this.selectedOption = option;

    if (this.onChange) {
      this.onChange(option);
    } else {
      this.changed.emit(option);
    }
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }
}
