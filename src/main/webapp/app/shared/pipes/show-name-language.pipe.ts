import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'showNameLanguage',
  pure: false,
})
export class ShowNameLanguagePipe implements PipeTransform {
  transform(language: string | null, value: { nameAr: string; nameEn: string; nameUr: string }): string {
    if (language) {
      return language === 'en' ? value.nameEn : language === 'ur' ? value.nameUr : value.nameAr;
    } else {
      return value.nameAr;
    }
  }
}
