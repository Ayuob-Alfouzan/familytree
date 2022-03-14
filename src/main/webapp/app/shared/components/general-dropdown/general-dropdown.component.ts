import { Component, forwardRef, Input, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { LanguageService } from 'app/shared/language/language.service';

@Component({
  selector: 'jhi-general-dropdown',
  templateUrl: './general-dropdown.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GeneralDropdownComponent),
      multi: true,
    },
  ],
})
export class GeneralDropdownComponent implements ControlValueAccessor {
  @Input()
  placeholder = 'global.select';

  @Input()
  data?: any[];

  @Input()
  label = 'name';

  @Output() changed = new EventEmitter<any>();

  selectedOption?: any;

  onChange?: (fn: any) => {};

  currentLanguage = this.languageService.onLangChange();

  _onTouched?: (fn: any) => {};

  constructor(private languageService: LanguageService) {}

  writeValue(value: any): void {
    this.selectedOption = value;
  }

  registerOnChange(fn: (_: any) => {}): void {
    this.onChange = fn;
  }

  changeSelectedOption(option: any): void {
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
