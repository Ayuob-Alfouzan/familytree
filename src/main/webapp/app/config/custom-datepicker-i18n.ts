import { Injectable } from '@angular/core';
import { NgbDatepickerI18n, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

const I18N_VALUES = {
  en: {
    weekdays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    weekLabel: 'week',
  },
  ur: {
    weekdays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    weekLabel: 'week',
  },
  'ar-ly': {
    weekdays: ['اثن', 'ثلا', 'اربع', 'خمي', 'جمع', 'سبت', 'احد'],
    months: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
    weekLabel: 'اسبوع',
  },
};

@Injectable()
export class CustomDatepickerI18n extends NgbDatepickerI18n {
  language: 'ar-ly' | 'en' | 'ur' = 'ar-ly';

  constructor(translateService: TranslateService) {
    super();

    const currentLang = translateService.currentLang;

    if (currentLang === 'ur') {
      this.language = 'ur';
    } else if (currentLang === 'en') {
      this.language = 'en';
    } else {
      this.language = 'ar-ly';
    }
  }

  getWeekdayLabel(weekday: number): string {
    return I18N_VALUES[this.language].weekdays[weekday - 1];
  }

  getWeekLabel(): string {
    return I18N_VALUES[this.language].weekLabel;
  }

  getMonthShortName(month: number): string {
    return I18N_VALUES[this.language].months[month - 1];
  }

  getMonthFullName(month: number): string {
    return this.getMonthShortName(month);
  }

  getDayAriaLabel(date: NgbDateStruct): string {
    return `${date.day}-${date.month}-${date.year}`;
  }

  getWeekdayShortName(weekday: number): string {
    return I18N_VALUES[this.language].weekdays[weekday - 1];
  }
}
