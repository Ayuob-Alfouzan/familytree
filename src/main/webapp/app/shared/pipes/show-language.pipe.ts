import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'showLanguage',
  pure: false,
})
export class ShowLanguagePipe implements PipeTransform {
  transform(language: string | null, value: { ar: string; en: string; ur: string }): string {
    if (language) {
      return language === 'en' ? value.en : language === 'ur' ? value.ur : value.ar;
    } else {
      return value.ar;
    }
  }
}
